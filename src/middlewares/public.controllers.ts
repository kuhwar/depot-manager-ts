import { NextFunction, Request, Response } from 'express'
import prisma from '../configurations/prisma'
const avilableHosts = prisma.host.findMany({
  include: {
    depot: true,
  }
})

export const populateDepotConfiguration = async (req: Request, res: Response, next: NextFunction) => {
  //We should move this to another middleware
  const currentHost = (await avilableHosts).find(host => host.name === req.hostname)

  if (!currentHost) {
    return res.render('404',{layout:false})
  }
  res.locals.depot = currentHost.depot
  next()
}

export const homeController =  async (req: Request, res: Response) => {
  return res.render('home')
}