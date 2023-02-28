const { Router } = require('express');
const { check } = require('express-validator');
const { login, google } = require('../controllers/auth');
const { validate } = require('../middlewares/validate');

const router = Router();

router.post('/login', [
    // Middlewares
    check('email' , 'Email is required').isEmail(),
    check('password' , 'Password is required').not().isEmpty(),
    validate
] , login );

router.post('/google', [
    // Middlewares
    check('id_token' , 'Google token is required').not().isEmpty(),
    validate
] , google );

module.exports = router;