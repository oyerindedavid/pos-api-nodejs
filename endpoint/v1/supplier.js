const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const SupplierController = require('../../controller/v1/supplier')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, SupplierController.create_supplier)

router.get('/account/:account_id', jsonParser, SupplierController.get_all_supplier)

router.get('/:id', jsonParser, SupplierController.get_supplier_by_id)

router.get('/page/:page', jsonParser, SupplierController.get_supplier_by_page)

router.put('/:id', jsonParser, SupplierController.update_supplier) 

router.delete('/:id/account/:account_id', jsonParser, SupplierController.delete_supplier)

module.exports = router;