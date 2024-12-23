import { Request, Response, NextFunction } from 'express';


export const homeController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/home', {layout:'admin', user: req.user});
}

export const catalogController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/catalog', {layout:'admin', user: req.user});
}

export const salesController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/sales', {layout:'admin', user: req.user});
}

export const manifestsController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/manifests', {layout:'admin', user: req.user});
}

export const postsController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/posts', {layout:'admin', user: req.user});
}

export const workersController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/workers', {layout:'admin', user: req.user});
}

export const settingsController =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/settings', {layout:'admin', user: req.user});
}

export const viewProductController  =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('admin/view-product', {layout:'admin'});
}