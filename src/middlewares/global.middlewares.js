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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNotFound = exports.populatePagination = exports.walmartLookupByUpc = exports.walmartLookupByQuery = exports.walmartLookupById = exports.validateHost = void 0;
const prisma_1 = __importDefault(require("../configurations/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const hostCacheExpirationSeconds = parseInt((_a = process.env.HOST_CACHE_EXPIRATION_SECONDS) !== null && _a !== void 0 ? _a : '1800');
const hostCache = new Map();
const validateHost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.locals.errors = [];
        const hostName = req.hostname;
        let currentHost = hostCache.get(hostName);
        if (!currentHost || currentHost.expiresAt < Date.now()) {
            const freshHostInformationFromDb = yield prisma_1.default.host.findUnique({ where: { name: hostName }, include: { depot: true } });
            const availableShelves = (freshHostInformationFromDb === null || freshHostInformationFromDb === void 0 ? void 0 : freshHostInformationFromDb.depot) ? yield prisma_1.default.shelf.findMany({ where: { depotId: freshHostInformationFromDb.depot.id } }) : [];
            currentHost = { expiresAt: Date.now() + (hostCacheExpirationSeconds * 1000), depot: freshHostInformationFromDb === null || freshHostInformationFromDb === void 0 ? void 0 : freshHostInformationFromDb.depot, availableShelves: availableShelves };
            hostCache.set(hostName, currentHost);
        }
        if (!currentHost.depot) {
            throw new Error(hostName + ' does not exist');
        }
        res.locals.depot = currentHost.depot;
        res.locals.availableShelves = currentHost.availableShelves;
        next();
    }
    catch (e) {
        res.locals.errors.push(e.message);
        return res.status(404).render('404', { layout: false });
    }
});
exports.validateHost = validateHost;
const walmartLookupById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        if (!req.query.walmartId || typeof req.query.walmartId !== 'string')
            return;
        if (!/^\d{4,11}$/.test(req.query.walmartId))
            return res.locals.errors.push('invalid walmartId: ' + req.query.walmartId);
        const filters = [];
        filters.push(`ids=${encodeURIComponent(req.query.walmartId)}`);
        const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?' + filters.join('&');
        const apiResponse = yield axios_1.default.get(url, { headers: getWalmartHeaders() });
        if (!Array.isArray(apiResponse.data.items) || apiResponse.data.items.length !== 1)
            return res.locals.errors.push('No or multiple items found in response: ', JSON.stringify(apiResponse.data));
        const walmartProduct = normalizeWalmartProduct(apiResponse.data.items[0]);
        // const variants:any = (apiResponse.data.items[0].variants ?? []).map((id:any)=>{return {id:id, name:id, selected:id===walmartProduct.walmartId}})
        const variationQueries = [];
        const variantIds = (_a = apiResponse.data.items[0].variants) !== null && _a !== void 0 ? _a : [];
        while (variantIds.length > 0) {
            const idSubset = variantIds.splice(0, 20);
            const variationLookupUrl = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?ids=${encodeURIComponent(idSubset.join(','))}`;
            variationQueries.push(axios_1.default.get(variationLookupUrl, { headers: getWalmartHeaders() }));
        }
        const variationResponses = yield Promise.all(variationQueries);
        walmartProduct.variants = variationResponses.map(resp => resp.data.items.map((i) => { return { id: i.itemId, name: getWalmartItemVariantLabel(i), selected: walmartProduct.walmartId === i.itemId, title: i.name }; })).reduce((previousValue, currentValue) => { return previousValue.concat(currentValue); }, []);
        res.locals.walmartProduct = walmartProduct;
    }
    catch (e) {
        res.locals.errors.push((_c = (_b = e.response) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : e.message);
    }
    finally {
        next();
    }
});
exports.walmartLookupById = walmartLookupById;
const walmartLookupByQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!res.locals.pageData.q || typeof res.locals.pageData.q !== 'string' || res.locals.pageData.q === '')
            return;
        const walmartRequestHeaders = getWalmartHeaders();
        const filters = [];
        filters.push(`query=${encodeURIComponent(res.locals.pageData.q)}`);
        filters.push(`numItems=${encodeURIComponent(res.locals.pageData.take)}`);
        if (res.locals.pageData.skip) {
            filters.push(`start=${encodeURIComponent(res.locals.pageData.skip)}`);
        }
        const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?' + filters.join('&');
        const apiResponse = yield axios_1.default.get(url, { headers: walmartRequestHeaders });
        res.locals.walmartProducts = apiResponse.data.items.map(normalizeWalmartProduct);
        res.locals.pageData.hasNext = Math.min(1000, apiResponse.data.totalResults) > (apiResponse.data.start + apiResponse.data.numItems);
    }
    catch (e) {
        res.locals.errors.push((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : e.message);
    }
    finally {
        next();
    }
});
exports.walmartLookupByQuery = walmartLookupByQuery;
const walmartLookupByUpc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.query.upc || typeof req.query.upc !== 'string')
            return;
        if (/^\d*$/.test(req.query.upc))
            return res.locals.errors.push('invalid upc: ' + req.query.walmartId);
        const walmartRequestHeaders = getWalmartHeaders();
        const filters = [];
        filters.push(`upc=${encodeURIComponent(req.query.upc)}`);
        const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?' + filters.join('&');
        const apiResponse = yield axios_1.default.get(url, { headers: walmartRequestHeaders });
        res.locals.walmartProducts = apiResponse.data;
    }
    catch (e) {
        res.locals.errors.push((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : e.message);
    }
    finally {
        next();
    }
});
exports.walmartLookupByUpc = walmartLookupByUpc;
const populatePagination = (req, res, next) => {
    var _a, _b;
    try {
        const q = typeof req.query.q === 'string' && req.query.q !== '' ? req.query.q : undefined;
        const skip = (typeof req.query.skip === 'string' && parseInt(req.query.skip) > 1) ? parseInt(req.query.skip) : 0;
        const take = (typeof req.query.count === 'string' && parseInt(req.query.count) > 1) ? parseInt(req.query.count) : 18;
        const orderBy = typeof req.query.orderBy === 'string' ? req.query.orderBy : '';
        const orderDirection = typeof req.query.orderDirection === 'string' && req.query.orderDirection === 'desc' ? 'desc' : 'asc';
        const previousSkip = skip - take < 0 ? 0 : skip - take;
        const nextSkip = skip + take;
        res.locals.pageData = {
            q: q,
            skip: skip,
            take: take,
            orderBy: orderBy,
            orderDirection: orderDirection,
            previousSkip: previousSkip,
            nextSkip: nextSkip
        };
    }
    catch (e) {
        res.locals.errors.push((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : e.message);
    }
    finally {
        next();
    }
};
exports.populatePagination = populatePagination;
const renderNotFound = (req, res) => {
    if (req.accepts('text/html')) {
        res.status(404).render('404', { layout: false });
    }
    else {
        res.status(404).send({});
    }
};
exports.renderNotFound = renderNotFound;
const getWalmartHeaders = () => {
    var _a;
    const walmartConsumerId = process.env.WM_CONSUMER_ID;
    const walmartAuthKey = Buffer.from((_a = process.env.WM_PRIVATE_KEY) !== null && _a !== void 0 ? _a : '', 'base64').toString('utf8');
    const walmartKeyVersion = process.env.WM_PRIVATE_KEY_VERSION;
    const time = Date.now();
    const signature = crypto_1.default.createSign('RSA-SHA256')
        .update(walmartConsumerId + '\n' + time + '\n' + walmartKeyVersion + '\n')
        // @ts-ignore
        .sign(walmartAuthKey, 'base64');
    return {
        'WM_CONSUMER.ID': walmartConsumerId,
        'WM_SEC.AUTH_SIGNATURE': signature,
        'WM_CONSUMER.INTIMESTAMP': time,
        'WM_SEC.KEY_VERSION': walmartKeyVersion,
    };
};
const normalizeWalmartProduct = (walmartProduct) => {
    const visuals = new Set();
    const variantLabel = getWalmartItemVariantLabel(walmartProduct);
    visuals.add(walmartProduct.largeImage.replace(/\?.*$/, ''));
    walmartProduct.imageEntities.forEach((image) => { var _a; return visuals.add(((_a = image.largeImage) !== null && _a !== void 0 ? _a : image.swatchImageSmall).replace(/\?.*$/, '')); });
    return {
        name: walmartProduct.name,
        upc: walmartProduct.upc,
        visuals: Array.from(visuals),
        msrp: walmartProduct.salePrice,
        suggestedPrice: Math.round(walmartProduct.salePrice * 0.8),
        description: walmartProduct.shortDescription,
        variationLabel: variantLabel,
        walmartId: walmartProduct.itemId,
        variants: []
    };
};
const getWalmartItemVariantLabel = (walmartProduct) => {
    const labelList = [];
    if (walmartProduct.size && walmartProduct.size !== '')
        labelList.push(walmartProduct.size);
    if (walmartProduct.color && walmartProduct.color !== '')
        labelList.push(walmartProduct.color);
    return labelList.join(' ');
};
