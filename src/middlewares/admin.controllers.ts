import {Request, Response} from 'express'
import prisma from '../configurations/prisma'
import {categories} from '../configurations/cache'

export const homeController = (req: Request, res: Response) => {
  res.locals.postPerformanceGraphData = {
    title: 'Listing Performance',
    categoryLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    valueLabels: [],
    dataSeries: [{
      name: 'John Doe',
      color: 'lime',
      data: Array.from({length: 7}, () => {return {value: Math.ceil(Math.random() * (100)) + 100}})
    }, {
      name: 'Mike Tyson',
      color: 'cyan',
      data: Array.from({length: 7}, () => {return {value: Math.ceil(Math.random() * (100)) + 100}})
    }, {
      name: 'Jane Doe',
      color: 'magenta',
      data: Array.from({length: 7}, () => {return {value: Math.ceil(Math.random() * (100)) + 100}})
    }]
  }
  const startFrom = Array.from({length: res.locals.postPerformanceGraphData.categoryLabels.length }, ()=>0)

  for (let index = 0; index < startFrom.length; index++){
    for (const series of res.locals.postPerformanceGraphData.dataSeries){
      series.data[index].start = startFrom[index]
      series.data[index].end = series.data[index].start + series.data[index].value
      startFrom[index] = series.data[index].end
    }
  }
  res.locals.yScale = 100 / Math.max(...startFrom)
  res.locals.xScale = 10 / startFrom.length
  res.locals.stockCountGraphData = {
    title: 'Stock Count',
    number: 342,
    label: "pcs"
  }

  res.render('admin/home')
}

export const listProductsController = async (req: Request, res: Response) => {
  res.locals.products = await prisma.product.findMany({
    where: {depotId: res.locals.depot.id, items: {some: {isDeleted: false}}, name: {search: res.locals.pageData.q}},
    include: {items: {where: {isDeleted: false}, include: {shelf: true}}},
    take: res.locals.pageData.take,
    skip: res.locals.pageData.skip
  })
  res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take
  res.render('admin/products')
}

export const createProductController = async (req: Request, res: Response) => {
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

    res.redirect(`/admin/products/${existingProduct.id}/add`)
  } catch (e: any) {
    res.locals.errors.push(e.message)
    res.redirect(req.originalUrl)
  }
}

export const salesController = (req: Request, res: Response) => {
  res.render('admin/sales')
}

export const manifestsController = (req: Request, res: Response) => {
  res.render('admin/manifests')
}

export const postsController = (req: Request, res: Response) => {
  res.render('admin/posts')
}

export const workersController = (req: Request, res: Response) => {
  res.render('admin/workers')
}

export const settingsController = (req: Request, res: Response) => {
  res.render('admin/settings')
}

export const viewProductController = (req: Request, res: Response) => {
  res.render('admin/view-product')
}
export const walmartLookupController = async (req: Request, res: Response) => {
  res.render('admin/walmart-lookup')
}