import express from 'express';
import bodyParser from 'body-parser'
import session from 'express-session'
import { RedisStore } from 'connect-redis'
import {createClient} from "redis"
import fileUpload from "express-fileupload"

const redisClient = createClient({url: process.env.REDIS_URL});
redisClient.connect().catch(e=>{console.log(e)});
redisClient.on('error', err => console.log('Redis Client Error', err));

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload())
app.use(express.static('public'))
app.use(session({
  secret: process.env.SESSION_SECRET??"",
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    client: redisClient,
    ttl: 1800
  })
}));

export default app;