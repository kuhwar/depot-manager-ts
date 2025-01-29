import {Request, Response} from "express";

export const indexSettingsController = (req: Request, res: Response) => {
  res.render('admin/settings')
}
