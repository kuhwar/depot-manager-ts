import {Request, Response} from 'express'
import prisma from '../configurations/prisma'

export const homeController = (req: Request, res: Response) => {
  res.render('admin/home', {layout: 'admin', user: req.user})
}

export const listProductsController = async (req: Request, res: Response) => {
  res.locals.products = await prisma.product.findMany({
    where: {depotId: res.locals.depot.id, items:{some:{isDeleted:false}}, name:{search: res.locals.pageData.q}},
    include: {items:{where:{isDeleted:false}, include: {shelf: true}}},
    take:res.locals.pageData.take,
    skip:res.locals.pageData.skip
  })
  res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take
  res.render('admin/products', {layout: 'admin', user: req.user})
}

export const newProductController = async (req: Request, res: Response) => {
  try{
    if (req.query.walmartId) return;


  } catch (e:any) {
    res.locals.errors = [e.message]
  } finally {
    res.render('admin/products/create', {layout: 'admin', user: req.user})
  }
}

export const salesController = (req: Request, res: Response) => {
  res.render('admin/sales', {layout: 'admin', user: req.user})
}

export const manifestsController = (req: Request, res: Response) => {
  res.render('admin/manifests', {layout: 'admin', user: req.user})
}

export const postsController = (req: Request, res: Response) => {
  res.render('admin/posts', {layout: 'admin', user: req.user})
}

export const workersController = (req: Request, res: Response) => {
  res.render('admin/workers', {layout: 'admin', user: req.user})
}

export const settingsController = (req: Request, res: Response) => {
  res.render('admin/settings', {layout: 'admin', user: req.user})
}

export const viewProductController = (req: Request, res: Response) => {
  res.render('admin/view-product', {layout: 'admin'})
}
export const walmartLookupController = async (req: Request, res: Response) => {
  res.render('admin/walmart-lookup', {layout: 'admin'})
}