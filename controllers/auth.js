const { response } = require('express');
const Usuario = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async( req , res = response ) => {


    const { email, password } = req.body;

    try {
        // Verify email
        const user = await Usuario.findOne({email});
        if ( !user ){
            return res.status(400).json({
                msg: 'User or Password invalid'
            });
        }
        // Verify if user is active on DB
        if ( !user.status ){
            return res.status(400).json({
                msg: 'Status false'
            });
        }
        // Verify password
        const validPassword = bcryptjs.compareSync( password , user.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'User or Password invalid'
            });
        }
        // Generate JWT
        const token = await generateJWT( user.id );

        res.status(200).json({
            ok: true,
            user,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Please contact to the admin'
        })
    }
}


module.exports = {
    login,
}