const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    text: {type: String, required: true},
    is_done: {type: Boolean, default: false, required: true},
    created_at: {type: Date, default: Date.now, required: true},
    updated_at: {type: Date, default: Date.now, required: true}
});

//automatic update timestamp on save
schema.pre(['save', 'update'], function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Todo', schema);
