const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/user');

const userGet = async(req, res = response) => {

    // const query = req.query;
    // Get all users
    const { limit = 5 , from = 0 } = req.query;

    // Execute at same time multiples asyncronus functions 
    const [ total , users] = await Promise.all([
        Usuario.countDocuments({ status:true }),
        Usuario.find({ status:true })
            .skip( Number(from) )
            .limit( Number(limit) )
    ]);

    res.json({
        msg: 'get API',
        total,
        users
    });
};

const userPost = async(req, res = response) => {
    

    const { name, email, password, role } = req.body;
    const usuario = new Usuario( { name, email, password, role } );
    // Verify if email exist 
    
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password , salt );
    // Saving user on MongoDB
    await usuario.save();
    res.status(201).json({
        msg: 'post API',
        usuario
    });
};

const userPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, ...rest } = req.body;
    // Verify ID with BD
    // TODO

    if( password ){
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password , salt );
    }

    const userDB = await Usuario.findByIdAndUpdate( id, rest );

    res.json({
        msg: 'put API',
        userDB
    });
};


const userDelete = async(req, res = response) => {

    const { id } = req.params;

    const uid = req.uid;
    // Delete complete ( bad practice )
    // const user = await Usuario.findByIdAndDelete( id );
    // Delete switching status property in DB ( good practice )
    const user = await Usuario.findByIdAndUpdate( id,  { status:false } );

    const userAuthenticated = req.user;

    res.json( {user , userAuthenticated} );
};

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API'
    });
};

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch,
}


