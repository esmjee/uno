var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Document = new Schema({
    id: String,
    doc: String,
}, {
    collection: 'documents'
});

module.exports = mongoose.model('Document', Document)
// mongoose.model('Document', Document);