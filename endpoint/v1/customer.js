const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const CustomerController = require('../../controller/v1/Customer')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, CustomerController.create_customer)

router.get('/', jsonParser, CustomerController.get_all_customer)

router.get('/:id', jsonParser, CustomerController.get_customer_by_id)

router.get('/:page', jsonParser, CustomerController.get_customer_by_page)

module.exports = router;