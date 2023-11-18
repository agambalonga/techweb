const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({

    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    artist_name: {
        type: String
    },
    genres: {
        type: String
    },
    image_URL : {
        type : String
        //required : true
    }
});

const Artist = mongoose.model('artists', artistSchema)

module.exports = Artist;