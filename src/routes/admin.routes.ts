import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import {
  listProductsController,
  homeController,
  postsController,
  salesController,
  settingsController,
  workersController,
  createProductController,
  walmartLookupController,
  saveProductController,
  setAdminLayout
} from '../middlewares/admin.controllers'
import { populatePagination, walmartLookupById, walmartLookupByQuery } from '../middlewares/global.middlewares'
import { createManifestController, indexManifestsController } from '../middlewares/admin'

const router = Router();
router.use(checkSession)
router.use(setAdminLayout)
router.get('/', homeController)
router.get('/products', populatePagination, listProductsController)
router.get('/products/create', walmartLookupById, createProductController)
router.post('/products/create', saveProductController)
router.get('/products/:id', homeController)
router.get('/sales', salesController)
router.get('/manifests', indexManifestsController)
router.post('/manifests', createManifestController)
// router.post('/manifests/:id', viewManifestController)
router.get('/posts', postsController)
router.get('/workers', workersController)
router.get('/settings', settingsController)
router.get("/walmart-lookup", populatePagination, walmartLookupByQuery, walmartLookupController)

export default router