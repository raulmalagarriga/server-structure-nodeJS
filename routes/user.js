const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user');
const { isRoleValid, theEmailExist, idUserExist } = require('../helpers/dbvalidators');
const { validate } = require('../middlewares/validate');


const router = Router();

router.get('/', userGet );

router.put('/:id',
    // Middlewares
    [
        check('id' , 'Invalid ID').isMongoId(),
        check('id').custom( idUserExist ),
        check('role').custom( isRoleValid ),     
        validate,      
    ] 
, userPut );

router.post('/', 
    // Middlewares
    [
        check( 'name','Name is required' ).not().isEmpty(),
        check( 'password','Password is required and longer than 6 letters' ).isLength( {min: 6} ).not().isEmpty(),
        check( 'email','Email invalid' ).isEmail(),
        check('email').custom( theEmailExist ),
        // check( 'role','Role invalid' ).isIn('ADMIN_ROLE' , 'USER_ROLE'),
        check('role').custom( isRoleValid ), 
        validate,
    ]
,userPost );

router.delete('/:id',
    // Middlewares
    [
        check('id' , 'Invalid ID').isMongoId(),
        check('id').custom( idUserExist ),
        validate,   
    ]
,userDelete );

router.patch('/',userPatch )


module.exports = router;