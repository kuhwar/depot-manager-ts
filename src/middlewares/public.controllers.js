"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewProductController = exports.homeController = void 0;
const prisma_1 = __importDefault(require("../configurations/prisma"));
const homeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.products = yield prisma_1.default.product.findMany({
        where: { depotId: res.locals.depot.id, items: { some: { isDeleted: false } }, name: { search: res.locals.pageData.q } },
        include: { items: { where: { isDeleted: false } } },
        take: res.locals.pageData.take,
        skip: res.locals.pageData.skip
    });
    res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take;
    return res.render('home');
});
exports.homeController = homeController;
const viewProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const productIdRegex = new RegExp(/[0-9]*/);
    if (!productIdRegex.test(productId)) {
        return res.status(404).render("404", { layout: false });
    }
    const product = yield prisma_1.default.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
        return res.status(404).render("404", { layout: false });
    }
    res.locals.product = product;
    return res.render('view-product');
});
exports.viewProductController = viewProductController;
