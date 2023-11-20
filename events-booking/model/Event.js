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

eventSchema.methods.formatDateTime = function(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

eventSchema.methods.formatDate = function(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const Event = mongoose.model('events', eventSchema)

module.exports = Event;