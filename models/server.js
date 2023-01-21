
const express = require('express');

class Server{

    constructor(){
        // Server props
        this.app = express();
        this.port = process.env.PORT;
        // Middlewares
        this.middlewares();

        // Routes application
        this.routes();
    }
    middlewares(){
        // Public folder
        this.app.use( express.static( 'public' ));

    }
    routes(){
        this.app.get('/api',  (req, res) => {
            res.send('Hello World');
          });
    }
    listen(){
        this.app.listen(this.port , () => {
            console.log(`Server running on localhost:${this.port}`);    
        });
    }
}

module.exports = Server;