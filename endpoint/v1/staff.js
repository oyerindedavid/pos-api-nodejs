const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const StaffController = require('../../controller/v1/staff')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, StaffController.create_staff)

router.get('/:account_id', jsonParser, StaffController.get_all_staff)

router.post('/validity', jsonParser, StaffController.is_staff_valid)

router.get('/:page', jsonParser, StaffController.get_staff_by_page)

//router.put('/:id', jsonParser, ProductController.update_product)

//router.delete('/:id', jsonParser, ProductController.delete_product)

module.exports = router;