const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const ModuleController = require('../../controller/v1/module')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, ModuleController.add_module_to_account)

router.get('/', ModuleController.get_all_modules)

router.post('/module', jsonParser, ModuleController.create_module)

router.get('/:id', jsonParser, ModuleController.get_a_module)

router.post('/status', jsonParser, ModuleController.update_module_status)

router.post('/renewal', jsonParser, ModuleController.update_module_renewal_date)

module.exports = router;