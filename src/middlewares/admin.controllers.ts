import {NextFunction, Request, Response} from 'express'
import prisma from '../configurations/prisma'
import {categories} from '../configurations/cache'
import {BarStackGraphType, BigNumberGraphType} from "../types";
import {parse as parseCsv} from 'csv-string';
import {searchByUpc} from "../configurations/walmart";


export const setAdminLayout = (req: Request, res: Response, next: NextFunction) => {
  try{
    res.locals.layout = "admin"
  } catch (e: any) {
    res.locals.errors.push(e.message ?? e.toString())
  } finally {
    res.locals.errors.length !== 0 ?  res.render("404", {layout: ""}) : next()
  }
}

export const homeController = (req: Request, res: Response) => {
  const postPerformanceGraphData: BarStackGraphType = {
    title: 'Listing Performance',
    categoryLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dataSeries: [{
      name: 'John Doe',
      color: 'lime',
      data: Array.from({length: 7}, () => {
        return {start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100}
      })
    }, {
      name: 'Mike Tyson',
      color: 'cyan',
      data: Array.from({length: 7}, () => {
        return {start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100}
      })
    }, {
      name: 'Jane Doe',
      color: 'magenta',
      data: Array.from({length: 7}, () => {
        return {start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100}
      })
    }],
    xScale: 1,
    yScale: 1
  }
  const startFrom = Array.from({length: postPerformanceGraphData.categoryLabels.length}, () => 0)

  for (let index = 0; index < startFrom.length; index++) {
    for (const series of postPerformanceGraphData.dataSeries) {
      series.data[index].start = startFrom[index]
      series.data[index].end = series.data[index].start + series.data[index].value
      startFrom[index] = series.data[index].end
    }
  }
  postPerformanceGraphData.yScale = -100 / Math.max(...startFrom)
  postPerformanceGraphData.xScale = 10 / startFrom.length

  const stockCountGraphData: BigNumberGraphType = {
    title: 'Stock Count',
    number: 342,
    label: "pcs",
    color: "cyan"
  }

  res.locals.stockCountGraphData = stockCountGraphData
  res.locals.postPerformanceGraphData = postPerformanceGraphData
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

export const indexManifestsController = (req: Request, res: Response) => {
  res.render('admin/manifests')
}

export const importManifestController = async (req: Request, res: Response) => {
  try{
    if(!req.files || !req.files.manifest) { res.locals.errors.push("No manifest file sent"); return; }
    // @ts-ignore
    if(req.files.manifest.mimetype !== "text/csv") { res.locals.errors.push("Invalid mimetype"); return; }
    // @ts-ignore
    res.locals.csvContent = req.files.manifest.data.toString()

    res.locals.csvData = parseCsv(res.locals.csvContent, {comma:",", output:"objects"})

    const upcList:string[] = Array.from(new Set(res.locals.csvData.filter((line:any)=> line.UPC !== "").map((line:any)=>line.UPC)))
    const products = await searchByUpc(upcList)
    console.log(products)
  } catch (e:any) {
    res.locals.errors.push(e.message)
  } finally {
    res.redirect("#")
  }
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