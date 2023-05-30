const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const AccountController = require('../../controller/v1/account')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, AccountController.create_account)

router.get('/', jsonParser, AccountController.get_all_account)

router.get('/:id', jsonParser, AccountController.get_account_by_id)

router.get('/:page', jsonParser, AccountController.get_account_by_page)

//router.put('/:id', jsonParser, ProductController.update_product)

//router.delete('/:id', jsonParser, ProductController.delete_product)

module.exports = router;