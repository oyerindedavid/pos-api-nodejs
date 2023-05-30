const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const ProductController = require('../../controller/v1/product')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, ProductController.create_product)

router.get('/', jsonParser, ProductController.get_all_product)

router.get('/:id', jsonParser, ProductController.get_product_by_id)

router.get('/search/:keyword', jsonParser, ProductController.search_product)

router.get('/:page', jsonParser, ProductController.get_product_by_page)

router.put('/:id', jsonParser, ProductController.update_product)

router.delete('/:id/account/:account_id', jsonParser, ProductController.delete_product)

module.exports = router;


