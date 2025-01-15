import {AcceptedColorType} from ".";

type BarStackGraphType = {
  title:string,
  categoryLabels: string[]
  dataSeries: {
    name: string
    color: AcceptedColorType
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