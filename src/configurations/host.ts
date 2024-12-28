import prisma from "./prisma";
import {Depot} from "@prisma/client";

const hostCacheExpirationSeconds = parseInt(process.env.HOST_CACHE_EXPIRATION_SECONDS ?? "1800")
type HostCacheItem = { cachedAt: Date, depot: Depot | undefined}
const hostCache: Map<string, HostCacheItem> = new Map<string, HostCacheItem>()


export const getHostInformation  = async (hostName: string) => {
  const currentHostInformationFromCache = hostCache.get(hostName)
  if (currentHostInformationFromCache && ((Date.now() - currentHostInformationFromCache.cachedAt.getTime()) < (hostCacheExpirationSeconds * 1000))) {
    return currentHostInformationFromCache.depot
  }
  const freshDepotInformationFromDb = await prisma.host.findUnique({where: {name: hostName}, include: {depot: true}})
  hostCache.set(hostName, {cachedAt: new Date(), depot: freshDepotInformationFromDb?.depot})
  return freshDepotInformationFromDb?.depot
}