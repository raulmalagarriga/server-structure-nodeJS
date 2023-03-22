const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct, getProducts, updateProduct, deleteProduct, getProductById } = require('../controllers/products');
const { validate } = require('../middlewares/validate');
const { validatejwt } = require('../middlewares/validate-jwt');
const { hasRole } = require('../middlewares/validate-roles');

const router = Router();

// Get all products - public
router.get('/' , getProducts );

router.get('/:id' , [
    check('id' , 'Invalid ID').isMongoId(),
    validatejwt,
    validate
] , getProductById)

// Create a product
router.post('/' ,[
    validatejwt,
    check('name' , 'Name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    validate,
], createProduct );

// Update a product
router.put('/:id' , [
    check('id' , 'Invalid ID').isMongoId(),
    validatejwt,
    validate,
] , updateProduct );

// Delete a product 
router.delete('/:id' , [
    check('id' , 'Invalid ID').isMongoId(),
    validatejwt,
    hasRole('ADMIN_ROLE'),
    validate
] , deleteProduct );
 

module.exports = router;