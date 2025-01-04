import { Router, Request, Response } from 'express'
import {homeController, viewProductController} from '../middlewares/public.controllers'
import {populatePagination} from "../middlewares/global.middlewares";

const router = Router()



router.get('/', populatePagination, homeController)
router.get('/p/:id', viewProductController)

export = router