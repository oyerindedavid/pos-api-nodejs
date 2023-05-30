const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const CategoryController = require('../../controller/v1/category')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, CategoryController.create_category)

router.get('/account/:account_id', jsonParser, CategoryController.get_all_category)

router.get('/:id', jsonParser, CategoryController.get_category_by_id)

router.get('/page/:page', jsonParser, CategoryController.get_category_by_page)

router.put('/:id', jsonParser, CategoryController.update_category)

router.delete('/:id/account/:account_id', jsonParser, CategoryController.delete_category)

module.exports = router;