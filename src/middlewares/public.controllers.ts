import { NextFunction, Request, Response } from 'express'
import prisma from '../configurations/prisma'
const avilableHosts = prisma.depotHost.findMany({
  include: {
    depot: true,
  }
})

export const homeController =  async (req: Request, res: Response, next: NextFunction) => {
  //We should move this to another middleware
  const currentHost = (await avilableHosts).find(host => host.host === req.host)


  return res.render('home',{depot:currentHost?.depot})
}