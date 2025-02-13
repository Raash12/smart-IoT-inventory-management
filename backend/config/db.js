const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // No deprecated options
        console.log('MongoDB connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);const mongoose = require('mongoose');
        const dotenv = require('dotenv');
        
        dotenv.config();
        
        const connectDB = async () => {
            try {
                await mongoose.connect(process.env.MONGO_URI); // No deprecated options
                console.log('MongoDB connected');
            } catch (error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
        };
        
        module.exports = connectDB;
        process.exit(1);
    }
};

module.exports = connectDB;