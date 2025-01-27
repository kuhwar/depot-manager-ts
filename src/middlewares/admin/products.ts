import {Request, Response} from "express";
import prisma from "../../configurations/prisma";
import {categories} from "../../configurations/cache";
import {searchByQuery} from "../../configurations/walmart";



export const listProducts = async (req: Request, res: Response) => {
  res.locals.products = await prisma.product.findMany({
    where: {depotId: res.locals.depot.id, items: {some: {isDeleted: false}}, name: {search: res.locals.pageData.q}},
    include: {items: {where: {isDeleted: false}, include: {shelf: true}}},
    take: res.locals.pageData.take,
    skip: res.locals.pageData.skip
  })
  res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take
  res.render('admin/products')
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    res.locals.categories = categories
  } catch (e: any) {
    res.locals.errors = [e.message]
  } finally {
    res.render('admin/products/create')
  }
}

export const saveProductController = async (req: Request, res: Response) => {
  try {
    let existingProduct = await prisma.product.findFirst({where: {depotId: res.locals.depot.id, walmartId: req.body.walmartId}})
    if (existingProduct) {
      await prisma.product.update({
        where: {id: existingProduct.id}, data: {
          categoryId: Number(req.body.categoryId),
          name: req.body.name,
          upc: req.body.upc,
          description: req.body.description,
          variationLabel: req.body.variationLabel,
          visuals: req.body.visuals ?? [],
          price: Number(req.body.price),
          items: {create: {shelfId: Number(req.body.shelfId)}}
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
          items: {create: {shelfId: Number(req.body.shelfId)}}
        }
      })
    }
    res.redirect(`/admin/products/${existingProduct.id}`)
  } catch (e: any) {
    res.locals.errors.push(e.message)
    res.render('admin/products/create')
  }
}

export const showProduct = (req: Request, res: Response) => {
  res.render('admin/view-product')
}

export const lookupProducts = async (req: Request, res: Response) => {
  try{
    if (!res.locals.pageData.q || res.locals.pageData.q === '') return
    res.locals.walmartProducts = await searchByQuery(res.locals.pageData.q, res.locals.pageData.take, res.locals.pageData.skip)
    res.locals.pageData.hasNext = res.locals.walmartProducts.length === res.locals.pageData.take
  } catch (e) {

  } finally {
    res.render('admin/products/lookup')
  }
}