import {create} from 'express-handlebars';

const handlebars = create({
  defaultLayout: 'public',
  extname: "hbs",
  helpers: {
    currency: (amount: number, fraction = 0) => {
      return Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: fraction}).format(amount);
    },
    sum: (amount1: number, amount2: number)=>{
      return amount1 + amount2;
    }
  }
});
export default handlebars;