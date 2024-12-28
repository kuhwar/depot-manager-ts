import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import { catalogController, homeController, manifestsController, postsController, salesController, settingsController, workersController } from '../middlewares/admin.controllers'

const router = Router();
router.use(checkSession)
router.get('/', homeController)
router.get('/catalog', catalogController)
router.get('/sales', salesController)
router.get('/manifests', manifestsController)
router.get('/posts', postsController)
router.get('/workers', workersController)
router.get('/settings', settingsController)
router.get('/products/:id', homeController)

export = router