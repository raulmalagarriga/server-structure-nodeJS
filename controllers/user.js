const { response } = require('express');


const userGet = (req, res = response) => {

    const query = req.query;

    res.json({
        msg: 'get API',
        query
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

    const id = req.params.id;

    res.json({
        msg: 'put API',
        id
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


