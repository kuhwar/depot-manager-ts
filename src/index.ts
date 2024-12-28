import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import session from 'express-session';

import publicRoutes from './routes/public.routes'
import authenticationRoutes from './routes/authentication.routes'
import adminRoutes from './routes/admin.routes'

import passport from './configurations/passport';
import handlebars from "./configurations/handlebars";
import {renderNotFound, validateHost} from "./middlewares/global.middlewares";

const app = express();
app.engine('hbs', handlebars.engine);
app.set("view engine", "hbs");

app.use(express.static('public'))
app.use(session({secret: process.env.SESSION_SECRET??"", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(validateHost)
app.use("/", publicRoutes)
app.use("/auth", authenticationRoutes)
app.use("/admin", adminRoutes)
app.all("*", renderNotFound)
// Start server
app.listen(process.env.PORT, ()=>console.log("Express server listening port", process.env.PORT));