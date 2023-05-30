const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const BasketController = require('../../controller/v1/basket')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, BasketController.submitBasket)

//router.post('/pay-held-transaction', jsonParser, BasketController.payHeldBasket)

router.delete('/delete-transaction/:account_id/:basket_id', jsonParser, BasketController.deleteHeldTransaction)

router.get('/held-transactions/:account_id', jsonParser, BasketController.heldTransactions)

//router.get('/:page', jsonParser, BasketController.get_basket_by_page)

//router.put('/:id', jsonParser, ProductController.update_product)

//router.delete('/:id', jsonParser, ProductController.delete_product)

module.exports = router;