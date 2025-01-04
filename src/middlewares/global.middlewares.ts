import {NextFunction, Request, Response} from "express";
import {Depot} from "@prisma/client";
import prisma from "../configurations/prisma";
import crypto from 'crypto'
import axios from 'axios'

const hostCacheExpirationSeconds = parseInt(process.env.HOST_CACHE_EXPIRATION_SECONDS ?? "1800")
type HostCacheItem = { cachedAt: Date, depot: Depot | undefined}
const hostCache: Map<string, HostCacheItem> = new Map<string, HostCacheItem>()

export const validateHost = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.errors = []
  const hostName = req.hostname

  const currentHostInformationFromCache = hostCache.get(hostName)
  if (currentHostInformationFromCache && ((Date.now() - currentHostInformationFromCache.cachedAt.getTime()) < (hostCacheExpirationSeconds * 1000))) {
    res.locals.depot = currentHostInformationFromCache.depot
    return next()
  }
  const freshDepotInformationFromDb = await prisma.host.findUnique({where: {name: hostName}, include: {depot: true}})
  if(freshDepotInformationFromDb && freshDepotInformationFromDb.depot){
    hostCache.set(hostName, {cachedAt: new Date(), depot: freshDepotInformationFromDb.depot})
    res.locals.depot = freshDepotInformationFromDb.depot
    return next()
  }
  return res.status(404).render("404", {layout: false})
}

export const walmartLookupById = async (req: Request, res: Response, next :NextFunction) => {{
  try{
    if (!req.query.walmartId  || typeof req.query.walmartId !== "string") return;
    if(!/^\d*$/.test(req.query.walmartId)) return res.locals.errors.push("invalid walmartId: "+req.query.walmartId)
    const walmartRequestHeaders = getWalmartHeaders()
    const filters: string[] = []
    filters.push(`ids=${encodeURIComponent(req.query.walmartId)}`)
    const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?' + filters.join("&")
    const apiResponse = await axios.get(url, { headers: walmartRequestHeaders })
    res.locals.walmartProducts = apiResponse.data
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}}

export const walmartLookupByQuery = async (req: Request, res: Response, next :NextFunction) => {{
  try{
    if (!req.query.q || typeof req.query.q !== "string" || req.query.q === "" ) return;
    const walmartRequestHeaders = getWalmartHeaders()
    const filters: string[] = []
    filters.push(`query=${encodeURIComponent(req.query.q)}`)
    filters.push(`numItems=${encodeURIComponent(12)}`)
    const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?' + filters.join("&")
    const apiResponse = await axios.get(url, { headers: walmartRequestHeaders })
    res.locals.walmartProducts = apiResponse.data.items
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}}

export const walmartLookupByUpc = async (req: Request, res: Response, next :NextFunction) => {{
  try{
    if (!req.query.upc || typeof req.query.upc !== "string" ) return;
    if(/^\d*$/.test(req.query.upc)) return res.locals.errors.push("invalid upc: "+req.query.walmartId)
    const walmartRequestHeaders = getWalmartHeaders()
    const filters: string[] = []
    filters.push(`upc=${encodeURIComponent(req.query.upc)}`)
    const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?' + filters.join("&")
    const apiResponse = await axios.get(url, { headers: walmartRequestHeaders })
    res.locals.walmartProducts = apiResponse.data
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}}

export const renderNotFound = (req: Request, res: Response) => {
  if (req.accepts("text/html")) {
    res.status(404).render("404", {layout: false})
  } else {
    res.status(404).send({})
  }
}

const getWalmartHeaders = () =>{
  const walmartConsumerId = process.env.WM_CONSUMER_ID
  const walmartAuthKey = Buffer.from(process.env.WM_PRIVATE_KEY??"", 'base64').toString('utf8');
  const walmartKeyVersion = process.env.WM_PRIVATE_KEY_VERSION
  const time = Date.now();

  const signature = crypto.createSign('RSA-SHA256')
    .update(walmartConsumerId + "\n" + time + "\n" + walmartKeyVersion + "\n")
    // @ts-ignore
    .sign(walmartAuthKey, 'base64');
  return {
    'WM_CONSUMER.ID': walmartConsumerId,
    "WM_SEC.AUTH_SIGNATURE": signature,
    "WM_CONSUMER.INTIMESTAMP": time,
    "WM_SEC.KEY_VERSION": walmartKeyVersion,
  }
}

export const populatePagination = (req: Request, res: Response, next :NextFunction) => {
  try{
    const q= typeof req.query.q === "string" && req.query.q !== "" ? req.query.q : undefined
    const skip= (typeof req.query.skip === "string" && parseInt(req.query.skip) > 1) ? parseInt(req.query.skip) : 0
    const take= (typeof req.query.count === "string" && parseInt(req.query.count) > 1) ? parseInt(req.query.count) : 12
    const orderBy= typeof req.query.orderBy === "string" ? req.query.orderBy : ""
    const orderDirection= typeof  req.query.orderDirection === "string" && req.query.orderDirection === "desc" ? "desc" : "asc"
    const previousSkip = skip - take < 0 ? 0 :skip - take
    const nextSkip = skip + take
    res.locals.pageData = {
      q: q,
      skip: skip,
      take: take,
      orderBy: orderBy,
      orderDirection: orderDirection,
      previousSkip: previousSkip,
      nextSkip: nextSkip
    }
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}

const normalizeWalmartProduct = (walmartProduct:any)=> {
  return walmartProduct;
}