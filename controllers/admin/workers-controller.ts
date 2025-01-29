import {Request, Response} from "express";

export const indexWorkersController = (req: Request, res: Response) => {
  res.render('admin/workers')
}