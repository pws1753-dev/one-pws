const router = require('express').Router();
const { getTemplate } = require('../controllers/templateController');

router.get('/', getTemplate);

module.exports = router;
