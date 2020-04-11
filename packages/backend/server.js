const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

const ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

let server = require('http').createServer(app);
const ioServer = require('./src/services/socket').setupSocket(server);

mongoose.connect(require("./src/configs/database").getUri(), { }, function(err) {
    if (err){
        console.log("Mongoose Connect error", err);

        throw err;
    }else{
        console.log("[DB] connected in env = "+ENV);
    }
});

//logic modifiers (body parser and cors)
app.set('ioServer', ioServer);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
});

app.use(express.static(__dirname + '/views'));
app.set('views', path.join(__dirname, '../app/views'));
app.use('/docs', express.static(__dirname + '/app/views/apidoc'));

//routes
app.get('/', function(req, res){
    res.json("Full Stack TODO list API.");
});

app.use('/api/v1', require("./src/routes/v1"));

//error handler
app.use(function(err, req, res, next) {
    console.log("Error: ", err);
    // console.log("Sentry error id: ", res.sentry);

    res.json({
        success: false,
        message: err.message,
        error: process.env.NODE_ENV === 'production' ? undefined : err  //if production send all the stack trace
    });
});

//start server
server.listen(PORT, function() {
    console.log("["+ENV+" - "+PORT+"] Full Stack TODO list API running...");
});

module.exports = app;
