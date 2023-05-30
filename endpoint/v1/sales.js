const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const SalesController = require('../../controller/v1/sales')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, SalesController.get_sales)

router.get('/:date', jsonParser, SalesController.get_sales_by_date)

router.post('/product', jsonParser, SalesController.get_sales_by_product)


module.exports = router;