import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import { listProductsController, homeController, manifestsController, postsController, salesController, settingsController, workersController, createProductController, walmartLookupController, saveProductController } from '../middlewares/admin.controllers'
import { populatePagination, walmartLookupById, walmartLookupByQuery } from '../middlewares/global.middlewares'

const router = Router();
router.use(checkSession)
router.get('/', homeController)
router.get('/products', populatePagination, listProductsController)
router.get('/products/create', walmartLookupById, createProductController)
router.post('/products/create', saveProductController)
router.get('/products/:id', homeController)
router.get('/sales', salesController)
router.get('/manifests', manifestsController)
router.get('/posts', postsController)
router.get('/workers', workersController)
router.get('/settings', settingsController)
router.get("/walmart-lookup", populatePagination, walmartLookupByQuery, walmartLookupController)

export default router