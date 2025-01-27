import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import {populatePagination, setAdminLayout, walmartLookupById} from '../middlewares/global.middlewares'
import {
  createManifestController,
  createProduct,
  indexManifestsController,
  listProducts,
  saveProductController,
  indexSalesController,
  indexPostsController,
  indexWorkersController, indexSettingsController, showReports, showProduct, lookupProducts
} from '../middlewares/admin'

const router = Router();
router.use(checkSession)
router.use(setAdminLayout)

router.get  ('/', showReports)

router.get  ('/products', populatePagination, listProducts)
router.get  ('/products/create', walmartLookupById, createProduct)
router.get  ("/products/create/lookup", populatePagination, lookupProducts)
router.post ('/products/create', saveProductController)
router.get  ('/products/:id', showProduct)

router.get  ('/sales', indexSalesController)

router.get  ('/manifests', indexManifestsController)
router.post ('/manifests', createManifestController)
// router.post('/manifests/:id', viewManifestController)

router.get  ('/posts', indexPostsController)

router.get  ('/workers', indexWorkersController)

router.get  ('/settings', indexSettingsController)

export default router