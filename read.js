var request = require('request');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "open!23",
    database: "deltaArhiv",
    multipleStatements: true
});


return con.connect(function (error, results, fields) {
    if (err) throw err;
    con.query("SELECT sku, quantity, price, time FROM delta WHERE sku = 'VFD004EL21A'", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        process.exit();
    });
});
