const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const DeviceGroupController = require('../../controller/v1/device-group')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, DeviceGroupController.create_device_group)

router.get('/:account_id', jsonParser, DeviceGroupController.get_all_device_group_by_account_id)


module.exports = router;