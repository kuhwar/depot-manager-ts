import crypto from "crypto";
import axios from "axios";

export const searchById = (ids:string[]):Promise<WalmartProduct[]> =>{
  return new Promise(async (resolve, reject)=>{
    try{
      const lookupQuery = []
      while (ids.length > 0) {
        const idSubset = ids.splice(0, 20)
        const variationLookupUrl = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?ids=${encodeURIComponent(idSubset.join(','))}`
        lookupQuery.push(axios.get(variationLookupUrl, { headers: getWalmartHeaders() }))
      }
      const lookupQueryResponses = await Promise.all(lookupQuery)
      resolve(lookupQueryResponses.map(apiResponse => apiResponse.data.items || Array.isArray(apiResponse.data.items) ? apiResponse.data.items.map(normalizeWalmartProduct) : []).reduce((previousValue, currentValue) => {return previousValue.concat(currentValue)}, []))
    } catch (e:any) {
      reject(e.message ?? e.toString())
    }
  })
}


const getWalmartHeaders = () => {
  const walmartConsumerId = process.env.WM_CONSUMER_ID
  const walmartAuthKey = Buffer.from(process.env.WM_PRIVATE_KEY ?? '', 'base64').toString('utf8')
  const walmartKeyVersion = process.env.WM_PRIVATE_KEY_VERSION
  const time = Date.now()

  const signature = crypto.createSign('RSA-SHA256')
    .update(walmartConsumerId + '\n' + time + '\n' + walmartKeyVersion + '\n')
    // @ts-ignore
    .sign(walmartAuthKey, 'base64')
  return {
    'WM_CONSUMER.ID': walmartConsumerId,
    'WM_SEC.AUTH_SIGNATURE': signature,
    'WM_CONSUMER.INTIMESTAMP': time,
    'WM_SEC.KEY_VERSION': walmartKeyVersion,
  }
}

const normalizeWalmartProduct = (walmartProduct: any):WalmartProduct=> {
  const visuals = new Set<string>()
  const variantLabel = getWalmartItemVariantLabel(walmartProduct)

  visuals.add(walmartProduct.largeImage.replace(/\?.*$/, ''))
  walmartProduct.imageEntities.forEach((image: any) => visuals.add((image.largeImage ?? image.swatchImageSmall).replace(/\?.*$/, '')))

  return {
    name: walmartProduct.name,
    upc: walmartProduct.upc,
    visuals: Array.from(visuals),
    msrp: walmartProduct.salePrice,
    suggestedPrice: Math.round(walmartProduct.salePrice * 0.8),
    description: walmartProduct.shortDescription,
    variationLabel: variantLabel,
    walmartId: walmartProduct.itemId,
    variants: []
  }
}

const getWalmartItemVariantLabel = (walmartProduct: any):string => {
  const labelList: string[] = []
  if (walmartProduct.size && walmartProduct.size !== '') labelList.push(walmartProduct.size)
  if (walmartProduct.color && walmartProduct.color !== '') labelList.push(walmartProduct.color)
  return labelList.join(' ')
}