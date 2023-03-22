const {Router} = require('express');
const { search } = require('../controllers/search');

const router = Router();


router.get('/:collection/:keyWord' , search);

module.exports = router;