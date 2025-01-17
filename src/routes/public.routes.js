"use strict";
const express_1 = require("express");
const public_controllers_1 = require("../middlewares/public.controllers");
const global_middlewares_1 = require("../middlewares/global.middlewares");
const router = (0, express_1.Router)();
router.get('/', global_middlewares_1.populatePagination, public_controllers_1.homeController);
router.get('/p/:id', public_controllers_1.viewProductController);
module.exports = router;
