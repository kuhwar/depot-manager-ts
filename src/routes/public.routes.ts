import { Router, Request, Response } from 'express'
import {homeController, viewProductController} from '../middlewares/public.controllers'

const router = Router()



router.get('/', homeController)
router.get('/p/:id', viewProductController)

export = router