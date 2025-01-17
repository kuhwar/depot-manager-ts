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
exports.walmartLookupController = exports.viewProductController = exports.settingsController = exports.workersController = exports.postsController = exports.manifestsController = exports.salesController = exports.saveProductController = exports.createProductController = exports.listProductsController = exports.homeController = void 0;
const prisma_1 = __importDefault(require("../configurations/prisma"));
const cache_1 = require("../configurations/cache");
const homeController = (req, res) => {
    const postPerformanceGraphData = {
        title: 'Listing Performance',
        categoryLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        dataSeries: [{
                name: 'John Doe',
                color: 'lime',
                data: Array.from({ length: 7 }, () => {
                    return { start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100 };
                })
            }, {
                name: 'Mike Tyson',
                color: 'cyan',
                data: Array.from({ length: 7 }, () => {
                    return { start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100 };
                })
            }, {
                name: 'Jane Doe',
                color: 'magenta',
                data: Array.from({ length: 7 }, () => {
                    return { start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100 };
                })
            }],
        xScale: 1,
        yScale: 1
    };
    const startFrom = Array.from({ length: postPerformanceGraphData.categoryLabels.length }, () => 0);
    for (let index = 0; index < startFrom.length; index++) {
        for (const series of postPerformanceGraphData.dataSeries) {
            series.data[index].start = startFrom[index];
            series.data[index].end = series.data[index].start + series.data[index].value;
            startFrom[index] = series.data[index].end;
        }
    }
    postPerformanceGraphData.yScale = -100 / Math.max(...startFrom);
    postPerformanceGraphData.xScale = 10 / startFrom.length;
    const stockCountGraphData = {
        title: 'Stock Count',
        number: 342,
        label: "pcs",
        color: "cyan"
    };
    res.locals.stockCountGraphData = stockCountGraphData;
    res.locals.postPerformanceGraphData = postPerformanceGraphData;
    res.render('admin/home');
};
exports.homeController = homeController;
const listProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.products = yield prisma_1.default.product.findMany({
        where: { depotId: res.locals.depot.id, items: { some: { isDeleted: false } }, name: { search: res.locals.pageData.q } },
        include: { items: { where: { isDeleted: false }, include: { shelf: true } } },
        take: res.locals.pageData.take,
        skip: res.locals.pageData.skip
    });
    res.locals.pageData.hasNext = res.locals.products.length === res.locals.pageData.take;
    res.render('admin/products');
});
exports.listProductsController = listProductsController;
const createProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.locals.categories = cache_1.categories;
    }
    catch (e) {
        res.locals.errors = [e.message];
    }
    finally {
        res.render('admin/products/create');
    }
});
exports.createProductController = createProductController;
const saveProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let existingProduct = yield prisma_1.default.product.findFirst({ where: { depotId: res.locals.depot.id, walmartId: req.body.walmartId } });
        if (existingProduct) {
            yield prisma_1.default.product.update({
                where: { id: existingProduct.id }, data: {
                    categoryId: Number(req.body.categoryId),
                    name: req.body.name,
                    upc: req.body.upc,
                    description: req.body.description,
                    variationLabel: req.body.variationLabel,
                    visuals: (_a = req.body.visuals) !== null && _a !== void 0 ? _a : [],
                    price: Number(req.body.price),
                    items: { create: { shelfId: Number(req.body.shelfId) } }
                }
            });
        }
        else {
            existingProduct = yield prisma_1.default.product.create({
                data: {
                    depotId: res.locals.depot.id,
                    categoryId: Number(req.body.categoryId),
                    name: req.body.name,
                    upc: req.body.upc,
                    description: req.body.description,
                    variationLabel: req.body.variationLabel,
                    visuals: (_b = req.body.visuals) !== null && _b !== void 0 ? _b : [],
                    price: Number(req.body.price),
                    walmartId: req.body.walmartId,
                    items: { create: { shelfId: Number(req.body.shelfId) } }
                }
            });
        }
        res.redirect(`/admin/products/${existingProduct.id}/add`);
    }
    catch (e) {
        res.locals.errors.push(e.message);
        res.redirect(req.originalUrl);
    }
});
exports.saveProductController = saveProductController;
const salesController = (req, res) => {
    res.render('admin/sales');
};
exports.salesController = salesController;
const manifestsController = (req, res) => {
    res.render('admin/manifests');
};
exports.manifestsController = manifestsController;
const postsController = (req, res) => {
    res.render('admin/posts');
};
exports.postsController = postsController;
const workersController = (req, res) => {
    res.render('admin/workers');
};
exports.workersController = workersController;
const settingsController = (req, res) => {
    res.render('admin/settings');
};
exports.settingsController = settingsController;
const viewProductController = (req, res) => {
    res.render('admin/view-product');
};
exports.viewProductController = viewProductController;
const walmartLookupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('admin/walmart-lookup');
});
exports.walmartLookupController = walmartLookupController;
