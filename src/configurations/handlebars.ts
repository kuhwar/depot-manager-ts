import {create} from 'express-handlebars'

export default create({
  defaultLayout: 'public',
  extname: "hbs",
  helpers: {
    currency: (amount: number) => {
      return Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0}).format(amount)
    },
    sum: (amount1: number, amount2: number)=>{
      return amount1 + amount2
    }
  }
})
