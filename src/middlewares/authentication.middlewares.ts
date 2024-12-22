import { Router, Request, Response } from 'express';
import passport from "passport";


export const loginContoller = (req: Request, res: Response)=>{
  res.render("login",{layout:false})
}
export const logoutContoller = (req: Request, res: Response) => {
  // req.logout();
  req.session.destroy(() => res.redirect('/auth/login'));
}
export const googleAuthenticatorController = passport.authenticate('google', { scope: ['email', 'profile'] })
export const googleAuthenticatorCallbackController = passport.authenticate('google', {failureRedirect: '/auth/login', successRedirect: '/admin',})