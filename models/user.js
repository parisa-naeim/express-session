const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Mongoose validation (see docs for more)
        unique: true
    },
    password: { // Most developers would prefer "passwordDigest"
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
