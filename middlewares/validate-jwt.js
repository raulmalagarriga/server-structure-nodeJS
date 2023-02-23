const { response, request, json } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');

const validatejwt = async( req = request , res = response, next ) => {

    // Read header 
    const token = req.header('x-token');
    if( !token ){
        return res.status(401).json({
            msg: 'Token is required'
        })
    }
    
    try {
        // Verify if token is valid
        const { uid } = jwt.verify( token , process.env.SECRETKEY );
        
        // Read user by uid
        const user = await Usuario.findById( uid );

        // Verify if user exist
        if( !user ){
            return res.status(401).json({
                msg: 'Invalid Token - user does not exist'
            });
        }

        // Verify if user is not deleted (status:true)
        if( !user.status ){
            return res.status(401).json({
                msg: 'Invalid Token - user status is false'
            });
        }

        req.user = user;        
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Invalid token'
        });

    }


}


 module.exports = {
    validatejwt,
 }