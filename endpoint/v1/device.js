const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const DeviceController = require('../../controller/v1/device')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, DeviceController.create_device)

router.get('/:device_id/account/:account_id', jsonParser, DeviceController.getA_device_by_id)

router.get('/:account_id', jsonParser, DeviceController.get_all_devices_by_account_id)

router.get('/:account_id/location/:l_area_id', jsonParser, DeviceController.get_all_devices_by_l_area_id)

router.get('/:account_id/:device_id', jsonParser, DeviceController.get_all_devices_by_device_id)

router.get('/:account_id/code/:d_code', jsonParser, DeviceController.get_all_devices_by_device_code)

router.get('/:account_id/assigned/:d_code', jsonParser, DeviceController.is_device_assigned)

router.put('/', jsonParser, DeviceController.update_device_code)

router.put('/info', jsonParser, DeviceController.update_device_info)

//router.delete('/:id', jsonParser, ProductController.delete_product)

module.exports = router;