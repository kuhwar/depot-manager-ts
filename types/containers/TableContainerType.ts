

export type TableContainerType = {
  title: string,
  columns:{
    header:string
    property:string
    width: undefined | number
  }[],
  data:any[]
}