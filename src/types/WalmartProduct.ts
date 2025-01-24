export type WalmartProduct = {
  name: string
  upc: string
  visuals: string[]
  msrp: number
  suggestedPrice: number
  description: string
  variationLabel: string
  walmartId: string
  variants: {
    id: string
    name: string
    selected: boolean
    title: string
  }[]
}
