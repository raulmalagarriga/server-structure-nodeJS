const { response } = require("express");
const { ObjectId} = require('mongoose').Types;
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');


const collectionsAvailable = [
    'users',
    'categories',
    'products',
    'productsByCategory',
    'roles'
]
// switch controllers
const searchUsers = async( keyWord = '' , res = response) => {
    // Validate if keyword is a mongo ID
    const isMongoID = ObjectId.isValid( keyWord ); // return true or false
    if( isMongoID ){
        const user = await User.findById( keyWord );
        return res.status(200).json({
            results: ( user ) ? [ user ] : []
        });
    }
   
    // regular expression, uppercase and lowercase does not affect the search  
    const regex = new RegExp( keyWord , 'i'); 
    
    // Search if is not a mongo Id (by name or email)
    const [total , users] = await Promise.all([
        User.countDocuments({
            $or:[{name: regex} , {email: regex}],
        }),
        User.find({
            $or:[{name: regex} , {email: regex}],
        })
    ]);  
    return res.status(200).json({ 
        total,
        results: [users] 
    });
}

const searchCategories = async( keyWord = '' , res = response ) => {
  // Validate if keyword is a mongo ID
  const isMongoID = ObjectId.isValid( keyWord ); // return true or false
  if( isMongoID ){
      const category = await Category.findById( keyWord );
      return res.status(200).json({
          results: ( category ) ? [ category ] : []
      });
  }
    // regular expression, uppercase and lowercase does not affect the search  
    const regex = new RegExp( keyWord , 'i'); 
    // Search if is not a mongo Id (by name)
    const [total , categories] = await Promise.all([
        Category.countDocuments({ name: regex }),
        Category.find({ name: regex })
    ]);

    return res.status(200).json({ 
        total,
        results: [categories] 
    });
}

const searchProducts = async( keyWord = '' , res = response ) => {
    // Validate if keyword is a mongo ID
    const isMongoID = ObjectId.isValid( keyWord ); // return true or false
    if( isMongoID ){
        const product = await Product.findById( keyWord ).populate('category' , 'name');
        return res.status(200).json({
            results: ( product ) ? [ product ] : []
        });
    }
    // regular expression, uppercase and lowercase does not affect the search  
    const regex = new RegExp( keyWord , 'i'); 
    // Search if is not a mongo Id (by name)
    const [total , products] = await Promise.all([
        Product.countDocuments({ name: regex }),
        Product.find({ name: regex }).populate('category' , 'name')
    ]);

    return res.status(200).json({ 
        total,
        results: [products] 
    });
}

const searchProductsByCategory = async( keyWord = '' , res = response ) => {
    
    // Validate if keyword is a mongo ID
    const isMongoID = ObjectId.isValid( keyWord ); // return true or false
    if( isMongoID ){
        const [total, products] = await Promise.all([
            Product.count({ category: ObjectId(keyWord) }),
            Product.find({ category: ObjectId(keyWord) })
        ]) 
        return res.status(200).json({
            total,
            results: (products) ? [products] : []
        })
    }        
    // // regular expression, uppercase and lowercase does not affect the search  
    const regex = new RegExp( keyWord , 'i'); 
    if( !isMongoID ){
        const category = await Category.findOne({name: regex})
        if( !category ){ return res.status(400).json({msg: `Category ${keyWord} does not exists`}) };
        const [total, products ] = await Promise.all([
            Product.countDocuments({ category: category._id }),
            Product.find({ category: category._id  })
            .populate('category','name')
        ]) 
        return res.status(200).json({
            total,
            results: (products) ? [products] : []
        })
    }
    
      
}

const search = (req , res = response) => {
    
    const { collection , keyWord } = req.params;
    if( !collectionsAvailable.includes( collection ) ){
        return res.status(400).json({
            msg: `The collection ${collection} does not exists, 
                the available collections are: ${collectionsAvailable}`
        });
    }
    switch (collection){

        case 'users':
            searchUsers( keyWord , res )
            break;
        case 'categories':
            searchCategories( keyWord , res )
            break;
        case 'products':
            searchProducts( keyWord , res )
            break;
        case 'productsByCategory':
            searchProductsByCategory( keyWord , res )
            break;
        default:
            res.status(500).json({
                msg: 'Collection forgotten, contact the administrator'
            });
    }
}

module.exports = {
    search
}