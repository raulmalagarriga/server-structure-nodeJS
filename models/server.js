
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server{

    constructor(){
        // Server props
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutesPath =      '/api/users';
        this.authRoutesPath =       '/api/auth';
        this.categoriesRoutesPath = '/api/categories';
        this.productsRouterPath =   '/api/products';
        this.searchRoutePath =      '/api/search';
        // Connect on DB
        this.MongoConnection(); 

        // Middlewares
        this.middlewares();

        // Routes application
        this.routes();
    }
    async MongoConnection(){
        await dbConnection();
    }
    middlewares(){
        // CORS
        this.app.use( cors() );
        // Parseo y lectura del body
        this.app.use( express.json() );
        // Public folder
        this.app.use( express.static( 'public' ));
    }
    routes(){
        this.app.use( this.authRoutesPath,       require('../routes/auth'));
        this.app.use( this.usersRoutesPath,      require('../routes/user'));
        this.app.use( this.categoriesRoutesPath, require('../routes/categories'));   
        this.app.use( this.productsRouterPath,   require('../routes/products'));  
        this.app.use( this.searchRoutePath,      require('../routes/search'));
        /* 
            Inventory options {
                price manager (ajuste de precios)
                charge inventory
            }, 
            sell module, 
            buy module,
            clients,
            providers

        */ 
    }
    listen(){
        this.app.listen(this.port , () => {
            console.log(`Server running on localhost:${this.port}`);    
        });
    }
}

module.exports = Server;