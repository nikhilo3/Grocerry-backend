const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async() => {

    try {
        console.log("DB_URL",DB_URL)
        await mongoose.connect('mongodb+srv://nikhilladani03:MdDnIyrZT2NSYF5f@cluster0.vzpap.mongodb.net/inventorymanagement', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db Connected');
        
    } catch (error) {
        console.log('Error ============')
        console.log(error);
        process.exit(1);
    }
 
};

 