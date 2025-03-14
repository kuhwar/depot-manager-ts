import { Request, Response } from 'express'
import { parse as parseCsv } from 'csv-string'
import { addMissingCheckDigit, generateManifestId, searchByUpc } from '../../configurations/walmart'
import prisma from '../../configurations/prisma'

export const listManifests = async (req: Request, res: Response) => {
  res.locals.manifests = await prisma.manifest.findMany({take:12, orderBy:{createdAt:"desc"}})
  res.render('admin/manifests')
}

export const saveManifest = async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.manifest) {
      res.locals.errors.push('No manifest file sent')
      return
    }
    if (Array.isArray(req.files.manifest)) {
      res.locals.errors.push('Multiple manifest files sent')
      return
    }
    if (req.files.manifest.mimetype !== 'text/csv') {
      res.locals.errors.push('Invalid mimetype')
      return
    }
    const csvContent = req.files.manifest.data.toString()
    const fileName = req.files.manifest.name
    const csvData = parseCsv(csvContent, {comma: ',', output: 'objects'})
    csvData.forEach((item: any) => {
      if (item.UPC !== '') item.UPC = addMissingCheckDigit(item.UPC).padEnd(12, "0").slice(-12)
    })
    const upcList: string[] = Array.from(new Set(csvData.filter((line: any) => line.UPC !== '').map((line: any) => line.UPC)))
    const apiProducts = await searchByUpc(upcList)
    await prisma.manifest.create({
      data: {
        id: generateManifestId(),
        cost: Number(req.body.cost),
        totalValue: Math.round(csvData.reduce((previousValue, currentValue) => previousValue + Number(currentValue["Ext. Retail"]), 0)*100)/100,
        fileName: fileName,
        fileContent: csvContent,
        items: {
          create: csvData.map((item: Record<string, string>) => {
            const apiProduct = apiProducts.find(p => p.upc === item["UPC"])
            return {
              upc: item["UPC"],
              name: item["Item Description"],
              palletId: item["Pallet ID"],
              quantity: Number(item["Qty"]),
              price: Number(item["Unit Retail"]),
              visual: apiProduct?.visuals[0],
              walmartId: apiProduct?.walmartId
            }
          })
        }
      }
    })
  } catch (e: any) {
    res.locals.errors.push(e.message)
  } finally {
    res.redirect("/admin/manifests")
  }
}

export const showManifest = async (req: Request, res: Response)=>{
  try {
    const id = req.params.id
    res.locals.manifest = await prisma.manifest.findUnique({where:{id:id}, include:{items: true}})
    res.locals.manifest.items = res.locals.manifest.items.map((item:any) => {return {
      id: item.id,
      name: item.name,
      upc: item.upc,
      price: item.price,
      visual: item.visual,
      action: `/admin/products/create?walmartId=${item.walmartId??""}&manifestItemId=${item.id}`
    }})
  } catch (e:any) {
    res.locals.errors.push(e.message ?? e.toString())
  } finally {
    res.render("admin/manifests/show")
  }
}
