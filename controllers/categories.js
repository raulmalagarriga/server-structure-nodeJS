const { response } = require('express');
const Category = require('../models/category');

// getCategories - paged - total - populate(research)
const getCategories = async( req, res = response ) => {

    const { limit = 10 , from } = req.query;

    // Execute at same time multiples asyncronus functions 
    const [ total , categories ] = await Promise.all([
        Category.countDocuments({ status:true }),
        Category.find({ status:true })
            .populate('user' , 'name')
            .skip( Number(from) )
            .limit( Number(limit) )
    ]);

    res.status(200).json({
        msg: 'Get Categories',
        total,
        categories
    })

}
// getCategory - One category - populate 
const getCategoryByName = async( req, res = response ) => {
    const name  = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne( {name} );
    if( !categoryDB ){
        return res.status(400).json({
            msg: `Category ${name} does not exist`
        });
    }

    res.status(200).json({
        msg: 'Get Categories',
        categoryDB
    });

}

const getCategoryById = async( req, res = response ) => {
    const id = req.params.id;

    const categoryDB = await Category.findById( id ).populate( 'user' , 'name' );
    if( !categoryDB ){
        return res.status(400).json({
            msg: 'Category does not exist'
        });
    }

    res.status(200).json({
        msg: 'Get Categories',
        categoryDB
    })
}

const createCategory = async( req , res = response ) => {

    // access to body's name property 
    const name = req.body.name.toUpperCase();
    
    const categoryDB  = await Category.findOne( {name} );
    if( categoryDB ){
        return res.status(400).json({
            msg: `Category ${name} alredy exists`
        });
    } 
    // Generate data to save
    const data = {
        name,
        user: req.user._id
    }

    // Prepare data 
    const category = await new Category( data );

    // Save data
    await category.save();

    res.status(201).json( category )
}

// updateCategory 
const updateCategory = async( req , res = response ) => {
    
    const id = req.params.id;
    const name = req.body.name.toUpperCase();
    
    const categoryToUpdate = await Category.findByIdAndUpdate( id , {name} );
    
    res.status(200).json({
        msg: 'Updated',
        categoryToUpdate
    });
}
// deleteCategory - status:false
const deleteCategory = async( req , res = response ) => {
    const id = req.params.id;

    const categoryToDelete = await Category.findByIdAndUpdate( id , {status:false} );

    res.status(200).json({
        msg: `Category ${categoryToDelete.name} was deleted`,
        categoryToDelete
    });
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryByName,
    getCategoryById,
    updateCategory,
    deleteCategory
}