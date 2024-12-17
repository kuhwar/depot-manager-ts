import express from 'express';
import publicRoutes from './routes/public.routes'
import { engine } from 'express-handlebars'

const app = express();
app.engine('hbs', engine({defaultLayout: 'public'}));
app.set("view engine", "hbs");
// Add Routes here
app.set('views', './dist/views');




app.use(express.static('public'))
app.use("/", publicRoutes)

// Start server
app.listen("8000", ()=>{
  console.log("Express server listening on http://localhost:8000");
});