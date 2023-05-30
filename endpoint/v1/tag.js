const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const TagController = require('../../controller/v1/tag')

//create application/json parser
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//API url
router.post('/', jsonParser, TagController.create_tag)

router.get('/', jsonParser, TagController.get_all_tag)

router.get('/:page', jsonParser, TagController.get_tag_by_page)

router.get('/account/:account_id', jsonParser, TagController.get_all_tag)

router.put('/:id', jsonParser, TagController.update_tag)

router.delete('/:id/account/:account_id', jsonParser, TagController.delete_tag)


module.exports = router;