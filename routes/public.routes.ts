import { Router} from 'express'
import {homeController, viewProductController} from '../controllers/public.controllers'
import {populatePagination} from "../controllers/global.middlewares";

const router = Router()



router.get('/', populatePagination, homeController)
router.get('/p/:id', viewProductController)

export default router