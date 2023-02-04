const Role = require('../models/role');
const Usuario = require('../models/user');

const isRoleValid =  async(role = '') => {
    const roleExist = await Role.findOne({ role });
    if( !roleExist ){
        throw new Error( `Role ${role} is not a valid rol` );
    }
}

const theEmailExist = async(email = '') => {
    const emailExist = await Usuario.findOne({ email });
    if( emailExist ){
        throw new Error( `The email ${ email } is in use`);
    }
}

const idUserExist = async( id ) => {
    const idExist = await Usuario.findById( id );
    if( !idExist ){
        throw new Error(` ID ${ id } does not exist`);
    }
}

module.exports = {
    isRoleValid,
    theEmailExist,
    idUserExist,
}