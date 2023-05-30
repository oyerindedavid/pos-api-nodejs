const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const UserController = require('../../controller/v1/user')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, UserController.create_user)

router.post('/validity', jsonParser, UserController.is_user_valid)

router.get('/', jsonParser, UserController.get_all_user)

router.get('/:page', jsonParser, UserController.get_user_by_page)

//router.put('/:id', jsonParser, ProductController.update_product)

//router.delete('/:id', jsonParser, ProductController.delete_product)

module.exports = router;