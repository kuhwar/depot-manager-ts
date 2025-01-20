import { NextFunction, Request, Response } from 'express'
import { Depot, Shelf } from '@prisma/client'
import prisma from '../configurations/prisma'
import crypto from 'crypto'
import axios from 'axios'

const hostCacheExpirationSeconds = parseInt(process.env.HOST_CACHE_EXPIRATION_SECONDS ?? '1800')
// Note to future myself: We can migrate this host cache to REDIS
type HostCacheItem = { expiresAt: number, depot: Depot | undefined, availableShelves: Shelf[] }
const hostCache: Map<string, HostCacheItem> = new Map<string, HostCacheItem>()

export const validateHost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.errors = []
    const hostName = req.hostname
    let currentHost = hostCache.get(hostName)

    if (!currentHost || currentHost.expiresAt < Date.now()) {
      const freshHostInformationFromDb = await prisma.host.findUnique({ where: { name: hostName }, include: { depot: true } })
      const availableShelves = freshHostInformationFromDb?.depot ? await prisma.shelf.findMany({ where: { depotId: freshHostInformationFromDb.depot.id } }) : []
      currentHost = { expiresAt: Date.now() + (hostCacheExpirationSeconds * 1000), depot: freshHostInformationFromDb?.depot, availableShelves: availableShelves }
      hostCache.set(hostName, currentHost)
    }

    if (!currentHost.depot) {
      throw new Error(hostName + ' does not exist')
    }
    res.locals.depot = currentHost.depot
    res.locals.availableShelves = currentHost.availableShelves
    next()
  } catch (e: any) {
    res.locals.errors.push(e.message)
    return res.status(404).render('404', { layout: false })
  }
}

export const walmartLookupById = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    if (!req.query.walmartId || typeof req.query.walmartId !== 'string') return
    if (!/^\d{4,11}$/.test(req.query.walmartId)) { res.locals.errors.push('invalid walmartId: ' + req.query.walmartId); return}
    const filters: string[] = []
    filters.push(`ids=${encodeURIComponent(req.query.walmartId)}`)
    const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?' + filters.join('&')
    const apiResponse = await axios.get(url, { headers: getWalmartHeaders() })
    if (!Array.isArray(apiResponse.data.items) || apiResponse.data.items.length !== 1) { res.locals.errors.push('No or multiple items found in response: ', JSON.stringify(apiResponse.data)); return; }
    const walmartProduct = normalizeWalmartProduct(apiResponse.data.items[0])
    // const variants:any = (apiResponse.data.items[0].variants ?? []).map((id:any)=>{return {id:id, name:id, selected:id===walmartProduct.walmartId}})

    const variationQueries = []
    const variantIds = apiResponse.data.items[0].variants ?? []
    while (variantIds.length > 0) {
      const idSubset = variantIds.splice(0, 20)
      const variationLookupUrl = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?ids=${encodeURIComponent(idSubset.join(','))}`
      variationQueries.push(axios.get(variationLookupUrl, { headers: getWalmartHeaders() }))
    }
    const variationResponses = await Promise.all(variationQueries)
    walmartProduct.variants = variationResponses.map(resp => resp.data.items.map((i: any) => {return { id: i.itemId, name: getWalmartItemVariantLabel(i), selected: walmartProduct.walmartId === i.itemId, title: i.name }})).reduce((previousValue, currentValue) => {return previousValue.concat(currentValue)}, [])
    res.locals.walmartProduct = walmartProduct
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}

export const walmartLookupByQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.pageData.q || typeof res.locals.pageData.q !== 'string' || res.locals.pageData.q === '') return
    const walmartRequestHeaders = getWalmartHeaders()
    const filters: string[] = []
    filters.push(`query=${encodeURIComponent(res.locals.pageData.q)}`)
    filters.push(`numItems=${encodeURIComponent(res.locals.pageData.take)}`)
    if (res.locals.pageData.skip) {
      filters.push(`start=${encodeURIComponent(res.locals.pageData.skip)}`)
    }
    const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?' + filters.join('&')
    const apiResponse = await axios.get(url, { headers: walmartRequestHeaders })
    res.locals.walmartProducts = apiResponse.data.items.map(normalizeWalmartProduct)
    res.locals.pageData.hasNext = Math.min(1000, apiResponse.data.totalResults) > (apiResponse.data.start + apiResponse.data.numItems)
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}

export const walmartLookupByUpc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const walmartRequestHeaders = getWalmartHeaders()
    const filters: string[] = []
    filters.push(`upc=${encodeURIComponent(res.locals.walmartUpcs.join(','))}`)
    const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?' + filters.join('&')
    const apiResponse = await axios.get(url, { headers: walmartRequestHeaders })
    res.locals.walmartProducts = apiResponse.data
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}

export const validateWalmartLookupByUpcRequest = (req: Request, res: Response, next: NextFunction) => {
  try{
    if (!req.query.upc || typeof req.query.upc !== 'string') return
    res.locals.walmartUpcs = req.query.upc.split(',')
    const invalidUpcs = res.locals.walmartUpcs.filter((upc:string)=> !/^\d*$/.test(upc))
    if (invalidUpcs.length !== 0) return res.locals.errors.push('invalid upcs: ' + invalidUpcs.join(","))
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}

export const populatePagination = (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = typeof req.query.q === 'string' && req.query.q !== '' ? req.query.q : undefined
    const skip = (typeof req.query.skip === 'string' && parseInt(req.query.skip) > 1) ? parseInt(req.query.skip) : 0
    const take = (typeof req.query.count === 'string' && parseInt(req.query.count) > 1) ? parseInt(req.query.count) : 18
    const orderBy = typeof req.query.orderBy === 'string' ? req.query.orderBy : ''
    const orderDirection = typeof req.query.orderDirection === 'string' && req.query.orderDirection === 'desc' ? 'desc' : 'asc'
    const previousSkip = skip - take < 0 ? 0 : skip - take
    const nextSkip = skip + take
    res.locals.pageData = {
      q: q,
      skip: skip,
      take: take,
      orderBy: orderBy,
      orderDirection: orderDirection,
      previousSkip: previousSkip,
      nextSkip: nextSkip,
      hasNext:false
    }
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}

export const renderNotFound = (req: Request, res: Response) => {
  if (req.accepts('text/html')) {
    res.status(404).render('404', { layout: "" })
  } else {
    res.status(404).send({})
  }
}

const getWalmartHeaders = () => {
  const walmartConsumerId = process.env.WM_CONSUMER_ID
  const walmartAuthKey = Buffer.from(process.env.WM_PRIVATE_KEY ?? '', 'base64').toString('utf8')
  const walmartKeyVersion = process.env.WM_PRIVATE_KEY_VERSION
  const time = Date.now()

  const signature = crypto.createSign('RSA-SHA256')
    .update(walmartConsumerId + '\n' + time + '\n' + walmartKeyVersion + '\n')
    // @ts-ignore
    .sign(walmartAuthKey, 'base64')
  return {
    'WM_CONSUMER.ID': walmartConsumerId,
    'WM_SEC.AUTH_SIGNATURE': signature,
    'WM_CONSUMER.INTIMESTAMP': time,
    'WM_SEC.KEY_VERSION': walmartKeyVersion,
  }
}

const normalizeWalmartProduct = (walmartProduct: any) => {
  const visuals = new Set<string>()
  const variantLabel = getWalmartItemVariantLabel(walmartProduct)

  visuals.add(walmartProduct.largeImage.replace(/\?.*$/, ''))
  walmartProduct.imageEntities.forEach((image: any) => visuals.add((image.largeImage ?? image.swatchImageSmall).replace(/\?.*$/, '')))

  return {
    name: walmartProduct.name,
    upc: walmartProduct.upc,
    visuals: Array.from(visuals),
    msrp: walmartProduct.salePrice,
    suggestedPrice: Math.round(walmartProduct.salePrice * 0.8),
    description: walmartProduct.shortDescription,
    variationLabel: variantLabel,
    walmartId: walmartProduct.itemId,
    variants: []
  }
}

const getWalmartItemVariantLabel = (walmartProduct: any) => {
  const labelList: string[] = []
  if (walmartProduct.size && walmartProduct.size !== '') labelList.push(walmartProduct.size)
  if (walmartProduct.color && walmartProduct.color !== '') labelList.push(walmartProduct.color)
  return labelList.join(' ')
}