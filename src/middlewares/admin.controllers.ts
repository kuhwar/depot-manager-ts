import { Request, Response, NextFunction } from 'express';


export const adminHomeController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/home', {layout:'admin', user: req.user});
}

export const viewProductController  =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/view-product', {layout:'admin'});
}