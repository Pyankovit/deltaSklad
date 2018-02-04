var express = require('express');
const iconv = require("iconv-lite");
var router = express.Router();


router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/delta//^[a-zA-Z]{2,15}/g', function (req, res, next) {
    res.render('details');
});

router.get('/sklad', function (req, res, next) {
    res.render('sklad');
});


module.exports = router;
