"use strict";
const express_1 = require("express");
const authentication_middlewares_1 = require("../middlewares/authentication.middlewares");
const router = (0, express_1.Router)();
router.get('/login', authentication_middlewares_1.loginContoller);
router.get('/google', authentication_middlewares_1.googleAuthenticatorController);
router.get('/google/callback', authentication_middlewares_1.googleAuthenticatorCallbackController);
router.get('/logout', authentication_middlewares_1.logoutContoller);
module.exports = router;
