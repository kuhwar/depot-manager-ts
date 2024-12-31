import {Request, Response} from 'express'
import prisma from '../configurations/prisma'

export const homeController = (req: Request, res: Response) => {
  res.render('admin/home', {layout: 'admin', user: req.user})
}

export const catalogController = async (req: Request, res: Response) => {
  res.locals.products = await prisma.product.findMany({
    where: {depotId: res.locals.depot.id, items: {some: {isDeleted: false}}},
    include: {items: {where: {isDeleted: false}, include: {shelf: true}}},
    take: 60
  })
  res.render('admin/catalog', {layout: 'admin', user: req.user})
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