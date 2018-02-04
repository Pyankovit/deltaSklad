var express = require('express');
var mysql = require('mysql');
var router = express.Router();


function getMySQLConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "open!23",
        database: "deltaArhiv",
        multipleStatements: true
    });
}


alert("vasia");
/* GET users listing. */
router.get('/', function (req, res, next) {
    var deltaList = [];

    var connection = getMySQLConnection();
    connection.connect();


    connection.query("SELECT sku, quantity, price, time FROM delta WHERE sku = 'VFD004EL21A'", function (error, rows, fields) {
        if (error) throw error;


        for (var i = 0; i < rows.length; i++) {
            alert("vasia");
            // Create an object to save current row's data
            var delta = {
                'name': rows[i].sku,
                'address': rows[i].quantity,
                'phone': rows[i].price,
                'id': rows[i].time
            }
            // Add object into array
            deltaList.push(delta);
        }

        res.render('test', {"delta": delta});


    });
    connection.end();
});


module.exports = router;