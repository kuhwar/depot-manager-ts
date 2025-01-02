import {Request, Response} from 'express'
import prisma from '../configurations/prisma'
import crypto from "crypto"
import axios from 'axios'

export const homeController = (req: Request, res: Response) => {
  res.render('admin/home', {layout: 'admin', user: req.user})
}

export const listProductsController = async (req: Request, res: Response) => {
  res.locals.products = await prisma.product.findMany({
    where: {depotId: res.locals.depot.id, items: {some: {isDeleted: false}}},
    include: {items: {where: {isDeleted: false}, include: {shelf: true}}},
    take: 60
  })
  res.render('admin/products', {layout: 'admin', user: req.user})
}

export const newProductController = async (req: Request, res: Response) => {
  res.render('admin/products-new', {layout: 'admin', user: req.user})
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
  if(!req.query.search || typeof req.query.search !== "string" || req.query.search.length < 4) {
    res.status(400).json([])
    return
  }
  const walmartConsumerId = process.env.WM_CONSUMER_ID
  const walmartAuthKey = Buffer.from(process.env.WM_PRIVATE_KEY??"", 'base64').toString('utf8');
  const walmartKeyVersion = process.env.WM_PRIVATE_KEY_VERSION
  const time = Date.now();

  const signature = crypto.createSign('RSA-SHA256')
    .update(walmartConsumerId + "\n" + time + "\n" + walmartKeyVersion + "\n")
    // @ts-ignore
    .sign(walmartAuthKey, 'base64');
  const headers = {
    'WM_CONSUMER.ID': walmartConsumerId,
    "WM_SEC.AUTH_SIGNATURE": signature,
    "WM_CONSUMER.INTIMESTAMP": time,
    "WM_SEC.KEY_VERSION": walmartKeyVersion,
  }

  const filters: string[] = []
  filters.push(`query=${encodeURIComponent(req.query.search)}`)
  filters.push(`numItems=${encodeURIComponent(12)}`)
  const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?' + filters.join("&")
  const apiResponse = await axios.get(url, { headers: headers })
  res.json(apiResponse.data.items)
}