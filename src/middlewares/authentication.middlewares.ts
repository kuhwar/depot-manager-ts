import {Request, Response, NextFunction} from 'express';
import passport from "passport";

export const loginController = (req: Request, res: Response) => {
  res.render("auth/login", {layout: "auth"})
}

export const logoutController = (req: Request, res: Response) => {
  // req.logout();
  req.session.destroy(() => res.redirect('/auth/login'));
}

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    res.locals.user = req.user;
    return next();
  }
  res.redirect('/auth/login')
}

export const googleAuthenticatorController = passport.authenticate('google', {scope: ['email', 'profile']})

export const googleAuthenticatorCallbackController = passport.authenticate('google', {
  failureRedirect: '/auth/login',
  successRedirect: '/admin',
})