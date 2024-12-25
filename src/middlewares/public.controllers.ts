import { Request, Response } from 'express'
import prisma from '../configurations/prisma'
const avilableHosts = prisma.host.findMany({
  include: {
    depot: true,
  }
})

export const homeController =  async (req: Request, res: Response) => {
  //We should move this to another middleware
  const currentHost = (await avilableHosts).find(host => host.name === req.host)


  return res.render('home',{depot:currentHost?.depot})
}