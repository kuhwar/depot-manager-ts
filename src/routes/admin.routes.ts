import { Router } from 'express';
import { checkSession } from '../middlewares/authentication.middlewares'
import { renderHome } from '../middlewares/admin.controllers'

const router = Router();

router.get('/', checkSession, renderHome)

export = router