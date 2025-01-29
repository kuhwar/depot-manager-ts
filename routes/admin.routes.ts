import { Router } from 'express';
import { checkSession } from '../controllers/authentication.middlewares'
import {populatePagination, setAdminLayout, walmartLookupById} from '../controllers/global.middlewares'
import {
  indexSalesController,
  indexWorkersController, indexSettingsController
} from '../controllers/admin'

import * as reportsController from "../controllers/admin/home-controller"
import * as manifestsController from "../controllers/admin/manifests-controller"
import * as postsController from "../controllers/admin/posts-controller"
import * as productsController from "../controllers/admin/products-controller"

const router = Router();
router.use(checkSession)
router.use(setAdminLayout)

router.get  ('/', reportsController.showReports)

router.get  ('/products', populatePagination, productsController.listProducts)
router.get  ('/products/create', walmartLookupById, productsController.createProduct)
router.get  ("/products/create/lookup", populatePagination, productsController.lookupProducts)
router.post ('/products', productsController.saveProduct)
router.get  ('/products/:id', productsController.showProduct)

router.get  ('/sales', indexSalesController)

router.get  ('/manifests', manifestsController.listManifests)
router.post ('/manifests', manifestsController.saveManifest)
router.post ('/manifests/:id', manifestsController.showManifest)

router.get  ('/posts', postsController.indexPostsController)

router.get  ('/workers', indexWorkersController)

router.get  ('/settings', indexSettingsController)

export default router