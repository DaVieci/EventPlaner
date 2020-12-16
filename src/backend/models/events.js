const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    user: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    }
}, { timestamps: true })

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;