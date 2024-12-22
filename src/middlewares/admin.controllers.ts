import { Request, Response, NextFunction } from 'express';


export const renderHome =  (req: Request, res: Response, next: NextFunction)  => {
  res.render('home');
}