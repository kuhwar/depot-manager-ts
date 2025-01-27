import {Request, Response} from "express";
import {BarStackGraphType} from "../../types/charts";

export const showReports = (req: Request, res: Response) => {
  const postPerformanceGraphData: BarStackGraphType = {
    title: 'Listing Performance',
    categoryLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dataSeries: [{
      name: 'John Doe',
      color: 'lime',
      data: Array.from({length: 7}, () => {
        return {start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100}
      })
    }, {
      name: 'Mike Tyson',
      color: 'cyan',
      data: Array.from({length: 7}, () => {
        return {start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100}
      })
    }, {
      name: 'Jane Doe',
      color: 'magenta',
      data: Array.from({length: 7}, () => {
        return {start: 0, end: 0, value: Math.ceil(Math.random() * (100)) + 100}
      })
    }],
    xScale: 1,
    yScale: 1
  }
  const startFrom = Array.from({length: postPerformanceGraphData.categoryLabels.length}, () => 0)

  for (let index = 0; index < startFrom.length; index++) {
    for (const series of postPerformanceGraphData.dataSeries) {
      series.data[index].start = startFrom[index]
      series.data[index].end = series.data[index].start + series.data[index].value
      startFrom[index] = series.data[index].end
    }
  }
  postPerformanceGraphData.yScale = -100 / Math.max(...startFrom)
  postPerformanceGraphData.xScale = 10 / startFrom.length

  res.locals.stockCountGraphData = {
    title: 'Stock Count',
    number: 342,
    label: 'pcs',
    color: 'cyan'
  }
  res.locals.postPerformanceGraphData = postPerformanceGraphData
  res.render('admin/home')
}
