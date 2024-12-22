import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import { adminHomeController } from '../middlewares/admin.controllers'

const router = Router();

router.get('/', checkSession, adminHomeController)
router.get('/products/:id', checkSession, adminHomeController)

export = router