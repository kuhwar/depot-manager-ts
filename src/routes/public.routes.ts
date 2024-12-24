import { Router, Request, Response } from 'express'
import { homeController } from '../middlewares/public.controllers'

const router = Router()



router.get('/',homeController)

export = router