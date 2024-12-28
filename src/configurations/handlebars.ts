import {create} from 'express-handlebars'

export = create({
  defaultLayout: 'public',
  extname: "hbs",
  helpers: {
    currency: (amount: number) => {
      return Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 2}).format(amount)
    }
  }
})
