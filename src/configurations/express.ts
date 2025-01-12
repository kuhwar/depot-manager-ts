import express from 'express';
import bodyParser from 'body-parser'
import session from 'express-session'

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))
app.use(session({secret: process.env.SESSION_SECRET??"", resave: false, saveUninitialized: true}));

export default app;