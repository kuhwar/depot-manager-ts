import { config } from 'dotenv';
config();

import app  from './configurations/express';
import publicRoutes from './routes/public.routes';
import authenticationRoutes from './routes/authentication.routes';
import adminRoutes from './routes/admin.routes';
import passport from './configurations/passport';
import handlebars from './configurations/handlebars';
import {renderNotFound, validateHost} from "./controllers/global.middlewares";

// set up view engine
app.engine('hbs', handlebars.engine);
app.set("view engine", "hbs");

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// routes and controllers
app.use(validateHost);
app.use("/", publicRoutes);
app.use("/auth", authenticationRoutes);
app.use("/admin", adminRoutes);
app.all("*", renderNotFound);

// Start server
app.listen(process.env.PORT, ()=>console.log("Express server listening port:", process.env.PORT));
