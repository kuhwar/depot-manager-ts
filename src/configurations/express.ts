import { Router } from 'express'
const appRouter = Router();
import publicRoutes from '../routes/public.routes'

appRouter.use("/", publicRoutes)