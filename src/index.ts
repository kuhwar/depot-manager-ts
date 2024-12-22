import express from 'express';
import publicRoutes from './routes/public.routes'
import { engine } from 'express-handlebars'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.engine('hbs', engine({defaultLayout: 'public', extname:"hbs"}));
app.set("view engine", "hbs");
// Add Routes here
// app.set('views', './dist/views');




app.use(express.static('public'))
app.use("/", publicRoutes)

// Start server
app.listen(process.env.PORT, ()=>{
  console.log("Express server listening on the http://localhost:8000");
});