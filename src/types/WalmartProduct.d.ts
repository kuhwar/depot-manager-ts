type WalmartProduct = {
  name: string
  upc: string
  visuals: string[]
  msrp: number
  suggestedPrice: number
  description: string
  variationLabel: string
  walmartId: string
  variants: {
    id: number
    name: string
    selected: boolean
    title: string
  }[]
}
