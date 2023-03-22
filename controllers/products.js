const { response } = require('express');
const Product = require('../models/product');
const Category = require('../models/category');

// GET 
const getProducts = async(req , res = response) => {
    
    const {limit = 10 , from } = req.query;

    // Execute at same time multiples asyncronus functions 
    const [ total , products ] = await Promise.all([
        Product.countDocuments({ status:true }),
        Product.find({ status:true })
            .populate('user' , 'name')
            .skip( Number(from) )
            .limit( Number(limit) )
    ]);

    res.status(200).json({
        msg: 'Get Categories',
        total,
        products
    })
};

// GET - BY ID
const getProductById = async( req, res = response ) => {
    const id = req.params.id;

    const productDB = await Product.findById( id ).populate( 'user' , 'name' );
    if( !productDB ){
        return res.status(400).json({
            msg: 'Product does not exist'
        });
    }

    res.status(200).json({
        msg: 'Get Product',
        productDB
    })
}

// POST - CREATE
const createProduct = async(req , res = response) => {
    
    const name = req.body.name.toUpperCase();
    const categoryName = req.body.category.toUpperCase();
    // Validate if category exists
    const categoryDB = await Category.findOne({name: categoryName });
    if(!categoryDB){
        return res.status(400).json({
            msg: `Category ${categoryName} does not exists`
        });
    }
    // Validate if product alredy exists
    const productDB = await Product.findOne({name});
    if(productDB){
        return res.status(400).json({
            msg: `Product ${name} alredy exists`
        });
    }
    const {price, description, stock} = req.body;
    const data = {
        name,
        user: req.user._id,
        category: categoryDB._id,
        price,
        description,
        stock
    }
    // Prepare data
    const product = await new Product( data );
    // Save data
    await product.save();
    return res.status(200).json( product )

}
// PUT - UPDATE
const updateProduct = async(req , res = response ) => {
    const id = req.params.id;
    const name = req.body.name.toUpperCase();
    const categoryName = req.body.category.toUpperCase();
    const {status, price, description, available, stock} = req.body;
    // verify and extract category from DB
    const categoryToFind = await Category.findOne({name: categoryName});
    if( !categoryToFind ){
        return res.status(400).json({
            msg: `Category ${categoryName} does not exists`
        }); 
    }
    // console.log(categoryToFind);

    const productToUpdate = await Product.findByIdAndUpdate( id, 
        {name, status, price, category: categoryToFind._id, description, available, stock});
    
    res.status(200).json({
        msg: 'Updated',
        productToUpdate
    });
}
// DELETE
const deleteProduct = async( req , res = response ) => {
    const id = req.params.id;

    const productToDelete = await Product.findByIdAndUpdate( id , {status:false} );

    res.status(200).json({
        msg: `Category ${productToDelete.name} was deleted`,
        productToDelete
    });
}
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};