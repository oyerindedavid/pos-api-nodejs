const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const BrandController = require('../../controller/v1/brand')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, BrandController.create_brand)

router.get('/account/:account_id', jsonParser, BrandController.get_all_brand)

router.get('/:id', jsonParser, BrandController.get_brand_by_id)

router.get('/:page', jsonParser, BrandController.get_brand_by_page)

router.put('/:id', jsonParser, BrandController.update_brand)

router.delete('/:id/account/:account_id', jsonParser, BrandController.delete_brand)

module.exports = router;