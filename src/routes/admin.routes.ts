import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import {populatePagination, setAdminLayout, walmartLookupById} from '../middlewares/global.middlewares'
import {
  saveManifest,
  createProduct,
  listManifests,
  listProducts,
  saveProduct,
  indexSalesController,
  indexPostsController,
  indexWorkersController, indexSettingsController, showReports, showProduct, lookupProducts, showManifest
} from '../middlewares/admin'

const router = Router();
router.use(checkSession)
router.use(setAdminLayout)

router.get  ('/', showReports)

router.get  ('/products', populatePagination, listProducts)
router.get  ('/products/create', walmartLookupById, createProduct)
router.get  ("/products/create/lookup", populatePagination, lookupProducts)
router.post ('/products', saveProduct)
router.get  ('/products/:id', showProduct)

router.get  ('/sales', indexSalesController)

router.get  ('/manifests', listManifests)
router.post ('/manifests', saveManifest)
router.post ('/manifests/:id', showManifest)

router.get  ('/posts', indexPostsController)

router.get  ('/workers', indexWorkersController)

router.get  ('/settings', indexSettingsController)

export default router