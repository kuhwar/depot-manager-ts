"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthenticatorCallbackController = exports.googleAuthenticatorController = exports.checkSession = exports.logoutContoller = exports.loginContoller = void 0;
const passport_1 = __importDefault(require("passport"));
const loginContoller = (req, res) => {
    res.render("auth/login", { layout: "auth" });
};
exports.loginContoller = loginContoller;
const logoutContoller = (req, res) => {
    // req.logout();
    req.session.destroy(() => res.redirect('/auth/login'));
};
exports.logoutContoller = logoutContoller;
const checkSession = (req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
        res.locals.layout = "admin";
        return next();
    }
    res.redirect('/auth/login');
};
exports.checkSession = checkSession;
exports.googleAuthenticatorController = passport_1.default.authenticate('google', { scope: ['email', 'profile'] });
exports.googleAuthenticatorCallbackController = passport_1.default.authenticate('google', {
    failureRedirect: '/auth/login',
    successRedirect: '/admin',
});
