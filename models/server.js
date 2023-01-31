
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server{

    constructor(){
        // Server props
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutesPath = '/api/users';
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
        this.app.use( this.usersRoutesPath , require('../routes/user'));
    }
    listen(){
        this.app.listen(this.port , () => {
            console.log(`Server running on localhost:${this.port}`);    
        });
    }
}

module.exports = Server;