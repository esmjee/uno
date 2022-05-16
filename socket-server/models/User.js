var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: String,
    email: String,
    password: String,
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', User)