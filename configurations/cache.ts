import { Category } from '@prisma/client'
import prisma from './prisma'

export let categories: Category[]
(async () => {
  categories = await prisma.category.findMany({where:{isDeleted:false}})
  console.log(categories.length, "categories have been loaded into cache")
})()
