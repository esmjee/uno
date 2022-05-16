var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    created_by: Object,
    code: String,
    winner: String,
    turns: {
        type: Array,
        default: []
    },
    topOfPile: {
        type: Object,
        default: { color: '', value: '' }
    },
    type: {
        type: String,
        default: 'unrated'
    },
    players: {
        type: Array,
        default: {}
    },
    status: {
        type: String,
        default: 'pending'
    },
    chat_messages: {
        type: Object,
        default: {}
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'games'
});

module.exports = mongoose.model('Game', Game)