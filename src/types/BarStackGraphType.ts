import {GraphColorType} from ".";

export type BarStackGraphType = {
  title:string,
  categoryLabels: string[]
  dataSeries: {
    name: string
    color: GraphColorType
    data: {
      value: number
      start: number
      end: number
    }[]
  }[]
  xScale: number
  yScale:number
}