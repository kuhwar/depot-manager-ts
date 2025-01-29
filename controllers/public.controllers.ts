import { Request, Response } from 'express'
import prisma from '../configurations/prisma'

export const homeController =  async (req: Request, res: Response) => {

  res.locals.products = await prisma.product.findMany({
    where: {depotId: res.locals.depot.id, items:{some:{isDeleted:false}}, name:{search: res.locals.pageData.q}},
    include: {items:{where:{isDeleted:false}}},
    take:res.locals.pageData.take,
    skip:res.locals.pageData.skip
  })
  res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take
  return res.render('home')
}

export const viewProductController =  async (req: Request, res: Response) => {
  const productId = req.params.id
  const productIdRegex = new RegExp(/[0-9]*/)
  if (!productIdRegex.test(productId)){
    return res.status(404).render("404",{layout:false})
  }
  const product = await prisma.product.findUnique({where:{id:parseInt(productId)}})
  if(!product){
    return res.status(404).render("404",{layout:false})
  }
  res.locals.product = product
  return res.render('view-product')
}