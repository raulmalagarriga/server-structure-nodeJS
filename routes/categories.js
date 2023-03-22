const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategoryById, updateCategory, getCategoryByName, deleteCategory } = require('../controllers/categories');
const { idCategoryExist } = require('../helpers/dbvalidators');

const { validate } = require('../middlewares/validate');
const { validatejwt } = require('../middlewares/validate-jwt');
const { hasRole } = require('../middlewares/validate-roles');

const router = Router();

// Get all categories - public
router.get('/' , getCategories );

// Get one categorie by name - public
router.get('/ByName' , getCategoryByName );

router.get('/:id' , [
    check('id' , 'ID does not exist').isMongoId(),
    validate
] ,getCategoryById );

// Create a categorie - private - any role with valid token
router.post('/' , [
    validatejwt,
    check('name' , 'Name is required').not().isEmpty(),
    validate
], createCategory );

// Update categorie by id - with valid token
router.put('/:id' , [
        check('id' , 'Invalid ID').isMongoId(),
        validatejwt,
        hasRole('ADMIN_ROLE' , 'USER_ROLE'),    
        validate,      
] ,updateCategory );

// Delete a categorie - role admin - status:false
router.delete('/:id' , [
    check('id' , 'Invalid ID').isMongoId(),
    check('id').custom( idCategoryExist ),
    validatejwt,
    hasRole('ADMIN_ROLE'),
    validate
] , deleteCategory);



module.exports = router;