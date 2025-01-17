import {GraphColorType} from ".";

type BarStackGraphType = {
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
export default BarStackGraphType