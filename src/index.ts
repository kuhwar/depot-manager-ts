import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import session from 'express-session';

import publicRoutes from './routes/public.routes'
import authenticationRoutes from './routes/authentication.routes'
import adminRoutes from './routes/admin.routes'

import passport from './configurations/passport';
import { engine } from 'express-handlebars'

const app = express();
app.engine('hbs', engine({defaultLayout: 'public', extname:"hbs"}));
app.set("view engine", "hbs");


app.use(session({
  secret: process.env.SESSION_SECRET??"",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'))

app.use("/", publicRoutes)
app.use("/auth", authenticationRoutes)
app.use("/admin", adminRoutes)
// Start server
app.listen(process.env.PORT, ()=>{
  console.log("Express server listening on the http://localhost:8000");
});