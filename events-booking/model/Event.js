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
    price : {
        type : Number
    },
    artist_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'artists'
    },
    release_date : {
        type : Date
    }
});

const Event = mongoose.model('events', eventSchema)

module.exports = Event;