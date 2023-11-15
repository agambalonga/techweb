const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    title : {
        type : String
    },
    date : {
        type : Date
    },
    city : {
        type : String
    },
    site : {
        type : String
    },
    price_for_ticket : {
        type : Number
    },
    seats : {
        type : Number
    },
    artist : {

        _id: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'artists'
        },
        name: {
            type : String
        }
    },
    image_URL : {
        type : String
    }
});

const Event = mongoose.model('events', eventSchema)

module.exports = Event;