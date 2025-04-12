import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    mediaUrl: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const Event = mongoose.model('Event', eventSchema);
export default Event;