import express from 'express';
import session from 'express-session';
import publicRoutes from './routes/public.routes'
import authenticationRoutes from './routes/authentication.routes'
import adminRoutes from './routes/admin.routes'
import { engine } from 'express-handlebars'
import dotenv from 'dotenv'
dotenv.config()

import passport from 'passport';
import passportStrategy from './configurations/passport';

const app = express();
app.engine('hbs', engine({defaultLayout: 'public', extname:"hbs"}));
app.set("view engine", "hbs");
// Add Routes here
// app.set('views', './dist/views');



passportStrategy(passport);
app.use(session({
  secret: process.env.SESSION_SECRET??"",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))
app.use("/", publicRoutes)
app.use("/", authenticationRoutes)
app.use("/admin", authenticationRoutes)
// Start server
app.listen(process.env.PORT, ()=>{
  console.log("Express server listening on the http://localhost:8000");
});