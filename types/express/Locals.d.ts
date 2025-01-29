import {Depot, Product} from "@prisma/client";

declare global {
  namespace Express {
    interface Locals {
      errors:string[]
      walmartLookup?:{
        upcs?: string[],
        ids?:string[],
        q?:string
      },
      pageData:{
        q: string | undefined,
        skip: number,
        take: number,
        orderBy: string,
        orderDirection: string,
        previousSkip: number,
        nextSkip: number,
        hasNext:boolean
      },
      depot:Depot,
      product: Product
      products: Product[]
    }
  }
}