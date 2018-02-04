/** * Module dependencies. */var express = require('express');var mysql = require('mysql');var cookieParser = require('cookie-parser');var bodyParser = require('body-parser');var expressValidator = require('express-validator');//var Chart = require('chart.js');var app = express();// var routes = require('./routes');// var user = require('./routes/user');var json = require('json');var http = require('http');var path = require('path');var jquery = require('jquery');var request = require('request');var cheerio = require('cheerio');var iconv = require('iconv-lite');var fs = require('fs');var cron = require('node-cron');var jsdom = require('jsdom');cron.schedule('00 8 * * 1-5', function () {    //8-00 pm mon-friday    var stop = 0;    var res = [];    var arr = [];    var datetime = new Date().toISOString().split('T')[0];    console.log(datetime);    var values = [];    var con = mysql.createConnection({        host: "localhost",        user: "root",        password: "open!23",        database: "deltaArhiv",        multipleStatements: true    });    request('http://link3.rts.ua:8235/', function (error, response, html) {        $ = cheerio.load(html);        $('script').each(function (i, elem) {            var scripts = $('script').filter(function () {                return ($(this).html().indexOf('sheet_HTML[0] = ') > -1);            });            if (scripts.length === 1 && stop == 0) {                var text = $(scripts[0]).html();                //  ...parse the text                var regex = /(<([^>]+)>)/ig;                var result = text.replace(regex, "");                res = result.split(/&nbsp;/g);                res = res.filter(String);                stop = 1;            }        });        for (var i = 0; i < res.length - 1; i++) {            var index = res[i].indexOf(res[i].match(/^[a-zA-Z]{2,15}/g));            if (index == 0 && res[2 + i] > 0 && res[3 + i] > 0) {                values = new Array(res[i], res[2 + i], Math.round(res[3 + i]), datetime);                arr.push(values);            }        }        var sql = 'INSERT INTO delta (sku, quantity, price, time) VALUES ?';        con.query(sql, [arr], function (err, result, fields) {            if (err) throw err;            console.log('Количиство добавленого товара: ' + result.affectedRows);            process.exit();        });        console.log(arr);    });});var quantitys = [], prices = [], times = [], ids = [];var jsonArray = [];var sumPrice = 0;//////	Create connection to MySQL database server./// function getMySQLConnection() {    return mysql.createConnection({        host: "localhost",        user: "root",        password: "open!23",        database: "deltaarhiv"        // multipleStatements: true    });}////// Use pug as templating engine. Pug is reskud jade.///app.set('view engine', 'pug');app.get('/chartjs', function (req, res, next) {    res.render('chartjs.pug');});////// HTTP Method	: GET/// Endpoint 	: /delta/// /// To get collection of delta saved in MySQL database.///app.get('/delta', function (req, res, next) {    var deltaList = [];    // Connect to MySQL database.    var connection = getMySQLConnection();    connection.connect();    // Do the query to get data.    connection.query('SELECT sku,id,time,quantity,price from delta GROUP BY sku', function (err, rows, fields) {        if (err) {            res.status(500).json({"status_code": 500, "status_message": "internal server error"});        } else {            // Loop check on each row            for (var i = 0; i < rows.length; i++) {                // Create an object to save current row's data                var delta = {                    'sku': rows[i].sku,                    'quantity': rows[i].quantity,                    'price': rows[i].price,                    'time': rows[i].time,                    'id': rows[i].id                }                // Add object into array                deltaList.push(delta);            }//console.log(deltaList);            // Render index.pug page using array            res.render('index', {"deltaList": deltaList});        }    });    // Close the MySQL connection    connection.end();});app.get('/sklad', function (req, res, next) {    res.render('sklad');});////// HTTP Method	: GET/// Endpoint	: /delta/:id/// /// To get specific data of delta based on their identifier.///app.get('/delta/:sku', function (req, res, next) {    var skuArray = [];    var qList = [];    var skuList = [];    var timeList = [];    var priceList = [];    var idList = [];    // Connect to MySQL database.    var connection = getMySQLConnection();    connection.connect();    // Do the query to get data.    connection.query('SELECT * FROM delta WHERE sku = ' + mysql.escape(req.params.sku.toString(16)) + ' LIMIT 10', function (err, rows, fields) {        console.log('SELECT * FROM delta WHERE sku = ' + mysql.escape(req.params.sku.toString(16)) + ' LIMIT 10');        if (err) {            res.status(500).json({"status_code": 500, "status_message": "internal server error"});        } else {            // Loop check on each row            for (var i = 0; i < rows.length; i++) {                // Create an object to save current row's data                var delta2 = {                    'sku': rows[i].sku,                    'quantity': rows[i].quantity,                    'price': rows[i].price,                    'time': rows[i].time,                    'id': rows[i].id                }                // Add objects into array.join('\n')                skuList.push(delta2);                skuArray.push(rows[i].sku);                qList.push(rows[i].quantity);                timeList.push(rows[i].time);                priceList.push(rows[i].price);                // idList.push(rows[i].id);                // Add object into array            }            jsonArray = JSON.stringify([qList, priceList, timeList]);            console.log(jsonArray);            console.log(skuList);            console.log(skuList[0].price);            console.log(skuList.length);            /*            for (var i=0; i<skuList.length; i++) {                skuList[i]["time"]=skuList[i]["time"].toJSON();                console.log(skuList[i]["time"]);            }            */            var skuListJSON = skuList;            console.log(skuListJSON);            var qListJSON = qList;            var timeListJSON = timeList;            var priceListJSON = priceList;            console.log(priceListJSON);            console.log(qListJSON);            var summa = priceListJSON.reduceRight(function (a, b) {                return a + b;            })            console.log(summa);            for (i = 0; i < priceListJSON.length; i++) {                sumPrice = (sumPrice + priceListJSON[i]);                console.log(priceListJSON[i]);            }            console.log(sumPrice);            console.log((sumPrice) / (priceListJSON.length));//console.log(skuList);            // Render index.pug page using array            res.render('details', {                "skuList": skuList,                "qList": JSON.stringify(qList),                "priceList": JSON.stringify(priceList),                "timeList": JSON.stringify(timeList)            });        }    });    // Close the MySQL connection    connection.end();});/*app.get('/delta/:time', function(req, res, next) {	connection.query('SELECT * FROM delta WHERE time = ' + mysql.escape(req.params.time.toString(16)) +' LIMIT 10', function(err, rows, fields) {	console.log('SELECT * FROM delta WHERE time = ' + mysql.escape(req.params.time.toString(16)) +' LIMIT 10');		  });*/app.get('/delta/time/:time', function (req, res, next) {    var skuArray = [];    var qList = [];    var skuList = [];    var timeList = [];    var priceList = [];    var idList = [];    // Connect to MySQL database.    var connection = getMySQLConnection();    connection.connect();    // Do the query to get data.    connection.query('SELECT * FROM delta WHERE time = ' + mysql.escape(req.params.time.toString(16)), function (err, rows, fields) {        console.log('SELECT * FROM delta WHERE time = ' + mysql.escape(req.params.time.toString(16)));        if (err) {            res.status(500).json({"status_code": 500, "status_message": "internal server error"});        } else {            // Loop check on each row            for (var i = 0; i < rows.length; i++) {                // Create an object to save current row's data                var delta2 = {                    'sku': rows[i].sku,                    'quantity': rows[i].quantity,                    'price': rows[i].price,                    'time': rows[i].time,                    'id': rows[i].id                }                // Add objects into array.join('\n')                skuList.push(delta2);                skuArray.push(rows[i].sku);                qList.push(rows[i].quantity);                timeList.push(rows[i].time);                priceList.push(rows[i].price);                // idList.push(rows[i].id);                // Add object into array            }            jsonArray = JSON.stringify([qList, priceList, timeList]);            console.log(jsonArray);            console.log(skuList);            console.log(skuList[0].price);            console.log(skuList.length);            /*            for (var i=0; i<skuList.length; i++) {                skuList[i]["time"]=skuList[i]["time"].toJSON();                console.log(skuList[i]["time"]);            }            */            var skuListJSON = skuList;            console.log(skuListJSON);            var qListJSON = qList;            var timeListJSON = timeList;            var priceListJSON = priceList;            console.log(priceListJSON);            console.log(qListJSON);            var summa = priceListJSON.reduceRight(function (a, b) {                return a + b;            })            console.log(summa);            for (i = 0; i < priceListJSON.length; i++) {                sumPrice = (sumPrice + priceListJSON[i]);                console.log(priceListJSON[i]);            }            console.log(sumPrice);            console.log((sumPrice) / (priceListJSON.length));//console.log(skuList);            // Render index.pug page using array            res.render('time', {                "skuList": skuList,                "qList": JSON.stringify(qList),                "priceList": JSON.stringify(priceList),                "timeList": JSON.stringify(timeList)            });        }    });    // Close the MySQL connection    connection.end();});////// Start the app on port 300 /// The endpoint should be: /// List/Index 	: http://localhost:3000/delta/// Details 	: http://localhost:3000/delta/2/// https://codeforgeek.com/2015/01/render-html-file-expressjs////https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routesapp.listen(3000, function () {    console.log('listening on port', 3000);});// catch 404 and forward to error handlerapp.use(function (req, res, next) {    var err = new Error('Not Found');    err.status = 404;    next(err);});// error handlerapp.use(function (err, req, res, next) {    // set locals, only providing error in development    res.locals.message = err.message;    res.locals.error = req.app.get('env') === 'development' ? err : {};    // render the error page    res.status(err.status || 500);    res.render('error');});app.use(bodyParser.json());app.use(bodyParser.urlencoded({extended: false}));app.use(expressValidator()); // Add this after the bodyParser middlewares!