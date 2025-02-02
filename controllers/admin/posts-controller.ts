import {Request, Response} from "express";

export const indexPostsController = (req: Request, res: Response) => {
  res.render('admin/posts')
}