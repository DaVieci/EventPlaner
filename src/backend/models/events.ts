const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;