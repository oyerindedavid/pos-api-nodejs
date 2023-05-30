const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const LocationAreaController = require('../../controller/v1/location-area')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, LocationAreaController.create_location_area)

router.get('/:id/account/:account_id', jsonParser, LocationAreaController.getA_location_areas_by_account_id)

router.get('/:account_id', jsonParser, LocationAreaController.get_location_areas_by_account_id)

module.exports = router;