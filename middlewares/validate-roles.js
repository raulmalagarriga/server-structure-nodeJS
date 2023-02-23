const { response } = require("express")


const isAdminRole = ( req , res = response , next ) => {

    if( !req.user ){
        return res.status(500).json({
            msg: 'Can not verify role, token is not checked'
        });
    }
    const { role , name } = req.user;

    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ name } is not an admin`
        });
    }
    next();
}

const hasRole = ( ...roles ) => {

    return ( req, res = response , next ) => {

        if( !req.user ){
            return res.status(500).json({
                msg: 'Can not verify role, token is not checked'
            });
        }
            const { role , name } = req.user;
        if( !roles.includes( role )){
            return res.status(401).json({
                msg: `${ name } is not authorized`
            });
        }
        

        next(); 
    }
}

module.exports = {
    isAdminRole,
    hasRole
}