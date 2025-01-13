import { Request, Response } from 'express'
import prisma from '../configurations/prisma'
import { categories } from '../configurations/cache'

export const homeController = (req: Request, res: Response) => {
  res.render('admin/home', { layout: 'admin', user: req.user })
}

export const listProductsController = async (req: Request, res: Response) => {
  res.locals.products = await prisma.product.findMany({
    where: { depotId: res.locals.depot.id, items: { some: { isDeleted: false } }, name: { search: res.locals.pageData.q } },
    include: { items: { where: { isDeleted: false }, include: { shelf: true } } },
    take: res.locals.pageData.take,
    skip: res.locals.pageData.skip
  })
  res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take
  res.render('admin/products', { layout: 'admin', user: req.user })
}

export const createProductController = async (req: Request, res: Response) => {
  try {
    res.locals.categories = categories
  } catch (e: any) {
    res.locals.errors = [e.message]
  } finally {
    res.render('admin/products/create', { layout: 'admin', user: req.user })
  }
}

export const saveProductController = async (req: Request, res: Response) => {
  try {
    let existingProduct = await prisma.product.findFirst({ where: { depotId: res.locals.depot.id, walmartId: req.body.walmartId } })
    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id }, data: {
          categoryId: Number(req.body.categoryId),
          name: req.body.name,
          upc: req.body.upc,
          description: req.body.description,
          variationLabel: req.body.variationLabel,
          visuals: req.body.visuals ?? [],
          price: Number(req.body.price),
          items: { create: { shelfId: Number(req.body.shelfId) } }
        }
      })
    } else {
      existingProduct = await prisma.product.create({
        data: {
          depotId: res.locals.depot.id,
          categoryId: Number(req.body.categoryId),
          name: req.body.name,
          upc: req.body.upc,
          description: req.body.description,
          variationLabel: req.body.variationLabel,
          visuals: req.body.visuals ?? [],
          price: Number(req.body.price),
          walmartId: req.body.walmartId,
          items: { create: { shelfId: Number(req.body.shelfId) } }
        }
      })
    }

    res.redirect(`/admin/products/${existingProduct.id}/add`)
  } catch (e: any) {
    res.locals.errors.push(e.message)
    res.redirect(req.originalUrl)
  }
}

export const salesController = (req: Request, res: Response) => {
  res.render('admin/sales', { layout: 'admin', user: req.user })
}

export const manifestsController = (req: Request, res: Response) => {
  res.render('admin/manifests', { layout: 'admin', user: req.user })
}

export const postsController = (req: Request, res: Response) => {
  res.render('admin/posts', { layout: 'admin', user: req.user })
}

export const workersController = (req: Request, res: Response) => {
  res.render('admin/workers', { layout: 'admin', user: req.user })
}

export const settingsController = (req: Request, res: Response) => {
  res.render('admin/settings', { layout: 'admin', user: req.user })
}

export const viewProductController = (req: Request, res: Response) => {
  res.render('admin/view-product', { layout: 'admin' })
}
export const walmartLookupController = async (req: Request, res: Response) => {
  res.render('admin/walmart-lookup', { layout: 'admin' })
}