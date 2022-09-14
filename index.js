import express from "express";
import session from 'express-session'

import router from './routers/index.js';
import db from "./db/mongo.js";
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();

app.use(session({
    secret: "123456",
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
//app.use(cors())
app.set('view engine', 'ejs')
app.set('views', __dirname + "/views")
app.use(express.static(__dirname + '/views'));

app.use(express.static('views'))
app.use((req, res, next) => {
    res.locals.messages = [] // {texto: String,  clase: String}
    res.locals.session = req.session;
    next()
})

app.listen(3000, () =>{
    console.log("runing from http://localhost:3000")
})

app.use('/', router)
