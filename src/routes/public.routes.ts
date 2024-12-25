import { Router, Request, Response } from 'express'
import { homeController, populateDepotConfiguration } from '../middlewares/public.controllers'

const router = Router()



router.get('/', populateDepotConfiguration, homeController)

export = router