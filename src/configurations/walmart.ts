import crypto from "crypto";
import axios from "axios";
import {WalmartProduct} from "../types/WalmartProduct";
import {response} from "express";

export const addMissingCheckDigit = (upc: string): string => {
  let multiplier = 3
  let sum = 0
  for (let i = upc.length - 1; i >= 0; i--) {
    sum += parseInt(upc[i]) * multiplier
    multiplier = multiplier === 1 ? 3 : 1
  }
  return upc + (10 - (sum % 10)).toString()
}

export const searchById = (ids: string[]): Promise<WalmartProduct[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const lookupQuery = []
      const headers = getWalmartHeaders()
      while (ids.length > 0) {
        const idSubset = ids.splice(0, 20)
        const variationLookupUrl = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?ids=${encodeURIComponent(idSubset.join(','))}`
        lookupQuery.push(axios.get(variationLookupUrl, {headers}))
      }
      const lookupQueryResponses = await Promise.all(lookupQuery)
      resolve(lookupQueryResponses.map(apiResponse => apiResponse.data.items && Array.isArray(apiResponse.data.items) ? apiResponse.data.items.map(normalizeWalmartProduct) : []).reduce((previousValue: WalmartProduct[], currentValue: WalmartProduct[]) => {
        return previousValue.concat(currentValue)
      }, []))
    } catch (e: any) {
      reject(e.message ?? e.toString())
    }
  })
}

export const searchByUpc = (upcs: string[]): Promise<WalmartProduct[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const lookupQuery = []
      const headers = getWalmartHeaders()
      while (upcs.length > 0) {
        const upcSubset = upcs.splice(0, 20)
        const url = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?upc=${(upcSubset.map((upc: string) => upc.padStart(13, "0").slice(-12)).join(','))}`
        console.log(url)
        const requestPromise = axios.get(url, { headers })
          .then(r => {return r.data.items && Array.isArray(r.data.items) ? r.data.items.map(normalizeWalmartProduct) : []})
          .catch((e:any) => {console.log(JSON.stringify(e.response?.data ?? e.message ?? e)); return []})
        lookupQuery.push(requestPromise)
        // const response = await axios.get(url, {headers})
        // console.log(response.data)
      }
      const lookupQueryResponses = await Promise.all(lookupQuery)
      resolve([])
    } catch (e: any) {
      reject(e)
    }
  })
}

const getWalmartHeaders = () => {
  if (!process.env.WM_CONSUMER_ID || !process.env.WM_PRIVATE_KEY || !process.env.WM_PRIVATE_KEY_VERSION) throw new Error("Walmart credentials are not set")
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

const normalizeWalmartProduct = (walmartProduct: any): WalmartProduct => {
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
    variants: (walmartProduct.variants ?? []).map((id: number) => {
      return {
        id: id,
        name: "",
        selected: false,
        title: ""
      }
    })
  }
}

const getWalmartItemVariantLabel = (walmartProduct: any): string => {
  const labelList: string[] = []
  if (walmartProduct.size && walmartProduct.size !== '') labelList.push(walmartProduct.size)
  if (walmartProduct.color && walmartProduct.color !== '') labelList.push(walmartProduct.color)
  return labelList.join(' ')
}
