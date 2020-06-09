const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.index);
router.post('/action', controller.action);

module.exports = router;


