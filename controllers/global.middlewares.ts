import {NextFunction, Request, Response} from 'express'
import {Depot, Shelf} from '@prisma/client'
import prisma from '../configurations/prisma'

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
      const freshHostInformationFromDb = await prisma.host.findUnique({where: {name: hostName}, include: {depot: true}})
      const availableShelves = freshHostInformationFromDb?.depot ? await prisma.shelf.findMany({where: {depotId: freshHostInformationFromDb.depot.id}}) : []
      currentHost = {
        expiresAt: Date.now() + (hostCacheExpirationSeconds * 1000),
        depot: freshHostInformationFromDb?.depot,
        availableShelves: availableShelves
      }
      hostCache.set(hostName, currentHost)
    }
    if (!currentHost.depot) return res.locals.errors.push(`${hostName} does not exist`)

    res.locals.depot = currentHost.depot
    res.locals.availableShelves = currentHost.availableShelves
  } catch (e: any) {
    res.locals.errors.push(e.message ?? e)
  } finally {
    if (res.locals.errors.length) {
      res.status(404).render('404', {layout: false})
    } else {
      next()
    }
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
      hasNext: false
    }
  } catch (e: any) {
    res.locals.errors.push(e.response?.data ?? e.message)
  } finally {
    next()
  }
}

export const renderNotFound = (req: Request, res: Response) => {
  if (req.accepts('text/html')) {
    res.status(404).render('404', {layout: false})
  } else {
    res.status(404).send({})
  }
}

export const setAdminLayout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.layout = 'admin'
  } catch (e: any) {
    res.locals.errors.push(e.message ?? e.toString())
  } finally {
    if (res.locals.errors.length) {
      res.status(404).render('404', {layout: false})
    } else {
      next()
    }
  }
}
