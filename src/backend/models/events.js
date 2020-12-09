const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    image: {
        reqired: false
    },
    category: {
        type: Object,
        required: false
    },
    user: {
        type: Object,
        required: true
    }
}, { timestamps: true })

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;