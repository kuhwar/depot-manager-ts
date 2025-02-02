import {Router} from 'express';
import * as authController from "../controllers/authentication.middlewares"
import * as globalController from "../controllers/global.middlewares"
import * as homeController from "../controllers/admin/home-controller"
import * as productsController from "../controllers/admin/products-controller"
import * as salesController from "../controllers/admin/sales-controller"
import * as manifestsController from "../controllers/admin/manifests-controller"
import * as postsController from "../controllers/admin/posts-controller"
import * as workersController from "../controllers/admin/workers-controller"
import * as settingsController from "../controllers/admin/settings-controller"

const router = Router();
router.use(authController.checkSession)
router.use(globalController.setAdminLayout)

router.get('/', homeController.showReports)

router.get('/products', globalController.populatePagination, productsController.list)
router.get('/products/create', productsController.create)
router.get("/products/create/lookup", globalController.populatePagination, productsController.catalogLookup)
router.post('/products', productsController.save)
router.get('/products/:id', productsController.view)

router.get('/sales', salesController.indexSalesController)

router.get('/manifests', manifestsController.listManifests)
router.post('/manifests', manifestsController.saveManifest)
router.get('/manifests/:id', manifestsController.showManifest)

router.get('/posts', postsController.indexPostsController)

router.get('/workers', workersController.indexWorkersController)

router.get('/settings', settingsController.indexSettingsController)

export default router