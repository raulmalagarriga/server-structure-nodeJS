const mongoose = require('mongoose'); 


const dbConnection = async() => {

    try {
        // Connect with mongodb
        mongoose.set("strictQuery", false); // To avoid a warning, stackoverflow 
        await mongoose.connect( process.env.MONGODBCNN );
        console.log('DB online');
    } catch (error) {
        throw new Error('Data Base error on startup');
    }

}
module.exports = {
    dbConnection,

}