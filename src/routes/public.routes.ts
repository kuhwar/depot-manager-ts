import { Router, Request, Response } from 'express'

const router = Router()


router.get('/', (req: Request, res: Response) => {
  res.render('home')
})
router.get('/hello-world', (req: Request, res: Response) => {
  res.send('Hello World!')
})

export = router