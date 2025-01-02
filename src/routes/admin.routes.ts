import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import { listProductsController, homeController, manifestsController, postsController, salesController, settingsController, workersController, newProductController, walmartLookupController } from '../middlewares/admin.controllers'

const router = Router();
router.use(checkSession)
router.get('/', homeController)
router.get('/products', listProductsController)
router.get('/products/new', newProductController)
router.get("/products/search", walmartLookupController)
router.get('/products/:id', homeController)
router.get('/sales', salesController)
router.get('/manifests', manifestsController)
router.get('/posts', postsController)
router.get('/workers', workersController)
router.get('/settings', settingsController)

export = router