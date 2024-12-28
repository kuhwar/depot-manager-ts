import {NextFunction, Request, Response} from "express";
import {Depot} from "@prisma/client";
import prisma from "../configurations/prisma";

const hostCacheExpirationSeconds = parseInt(process.env.HOST_CACHE_EXPIRATION_SECONDS ?? "1800")
type HostCacheItem = { cachedAt: Date, depot: Depot | undefined}
const hostCache: Map<string, HostCacheItem> = new Map<string, HostCacheItem>()

export const validateHost = async (req: Request, res: Response, next: NextFunction) => {
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
export const renderNotFound = (req: Request, res: Response, next: NextFunction) => {
  if (req.accepts("text/html")) {
    res.status(404).render("404", {layout: false})
  } else {
    res.status(404).send({})
  }
}