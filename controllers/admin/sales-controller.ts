import {Request, Response} from "express";

export const indexSalesController = (req: Request, res: Response) => {
  res.render('admin/sales')
}