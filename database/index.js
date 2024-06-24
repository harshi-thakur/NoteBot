const mongoose = require('mongoose');
const { startReminder } = require('./reminder');
async function startDb() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('Connected to MongoDB');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    startReminder();
}
module.exports = { startDb }; 
