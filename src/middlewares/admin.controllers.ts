import {Request, Response} from 'express'
import {searchByQuery} from "../configurations/walmart";

export const viewProductController = (req: Request, res: Response) => {
  res.render('admin/view-product')
}
export const walmartLookupController = async (req: Request, res: Response) => {
  try{
    if (!res.locals.pageData.q || res.locals.pageData.q === '') return
    res.locals.walmartProducts = await searchByQuery(res.locals.pageData.q, res.locals.pageData.take, res.locals.pageData.skip)
    res.locals.pageData.hasNext = res.locals.walmartProducts.length === res.locals.pageData.take
  } catch (e) {

  } finally {
    res.render('admin/walmart-lookup')
  }
}
