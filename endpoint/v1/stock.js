const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const StockController = require('../../controller/v1/stock')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, StockController.stock_take)

router.post('/info', jsonParser, StockController.get_a_stock_info)

module.exports = router;