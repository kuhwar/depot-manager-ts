import {Request, Response} from "express";
import prisma from "../../configurations/prisma";
import {categories} from "../../configurations/cache";
import {searchById, searchByQuery} from "../../configurations/walmart";

export const list = async (req: Request, res: Response) => {
  res.locals.products = await prisma.product.findMany({
    where: {depotId: res.locals.depot.id, items: {some: {isDeleted: false}}, name: {search: res.locals.pageData.q}},
    include: {items: {where: {isDeleted: false}, include: {shelf: true}}},
    take: res.locals.pageData.take,
    skip: res.locals.pageData.skip
  })
  res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take
  res.render('admin/products')
}

export const create = async (req: Request, res: Response) => {
  try {
    res.locals.categories = categories
    if (typeof req.query.walmartId === 'string' && /^\d{4,11}$/.test(req.query.walmartId)) {
      res.locals.product = await prisma.product.findFirst({where:{walmartId: req.query.walmartId}})
      const productsFound = await searchById([req.query.walmartId])
      if(productsFound.length === 0) {res.locals.errors.push('no products found with walmartId: ' + req.query.walmartId); return;}
      const walmartProduct = productsFound[0]
      const ids = walmartProduct.variants.map(v=>v.id.toString())
      res.locals.variants = (await searchById(ids)).map(v => {return {id: v.walmartId, name:v.variationLabel, selected: walmartProduct.walmartId === v.walmartId, title:v.name}})
    }
  } catch (e: any) {
    res.locals.errors = [e.message]
  } finally {
    res.render('admin/products/create')
  }
}

export const save = async (req: Request, res: Response) => {
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
    res.redirect(`/admin/products`)
  } catch (e: any) {
    res.locals.errors.push(e.message)
    res.render('admin/products/create')
  }
}

export const view = (req: Request, res: Response) => {
  res.render('admin/view-product')
}

export const catalogLookup = async (req: Request, res: Response) => {
  try{
    if (!res.locals.pageData.q || res.locals.pageData.q === '') return
    res.locals.walmartProducts = await searchByQuery(res.locals.pageData.q, res.locals.pageData.take, res.locals.pageData.skip)
    res.locals.pageData.hasNext = res.locals.walmartProducts.length === res.locals.pageData.take
  } catch (e) {

  } finally {
    res.render('admin/products/lookup')
  }
}