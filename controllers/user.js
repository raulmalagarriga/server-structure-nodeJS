const { response } = require('express');


const userGet = (req, res = response) => {
    res.json({
        msg: 'get API'
    });
};

const userPost = (req, res = response) => {
    
    const body = req.body;


    res.status(201).json({
        msg: 'post API',
        body
    });
};

const userPut = (req, res = response) => {
    res.json({
        msg: 'put API'
    });
};


const userDelete = (req, res = response) => {
    res.json({
        msg: 'delete API'
    });
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


