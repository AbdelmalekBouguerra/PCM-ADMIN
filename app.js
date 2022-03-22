const express = require('express');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const hbs = require('hbs');
const session = require('cookie-session');
const path = require('path');
// env config
dotenv.config();

// server config
const app = express();
// cert and key for https server
const key = fs.readFileSync(process.env.CERT_KEY);
const cert = fs.readFileSync(process.env.CERT);

var httpsServer = https.createServer({key: key, cert: cert}, app);
const port = process.env.PORT;

httpsServer.listen(port,()=>{
    console.log(`Server started : https://localhost:${port}`);
})

// Parse URL encoded bodies sent by forms
app.use(express.urlencoded({ extended:false}))
// Parse JSON bodies as sent by API clients
app.use(express.json())

// Session config
app.use(session({
    name:'session',
    secret:'key1',
    key: ['key1','key2'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours

}))

// define public directory
const publicDirectory = path.join(__dirname,'./public')
app.use(express.static(publicDirectory))

// Define view engine
app.set('view engine', 'hbs');

// template hbs
hbs.registerPartials(path.join(__dirname, 'views', 'templates'))

// Routers
const indexRouter = require('./routes/index');

app.use('/',indexRouter);
