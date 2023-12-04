const { Router }  = require('express');
const Artist = require('../model/Artist');
const Event = require('../model/Event');

//Funzione che prende tutti gli artisti
module.exports.getAll = async (req, res) => {
    try {
        const artists = await Artist.find({});
        res.status(200).json({artists: artists});
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors: err });
    }
};

//Funzione che prende un artista in base all'id
module.exports.getArtistById = async (req, res) => {
    let artist={};
    let events =[];
    try {
        //find artist by id
        artist = await Artist.findById(req.params.id);
        //find all events not expired by artist
        events = await Event.find({'artist._id': artist._id, date: {$gte: new Date()}}).sort({date: 1});

        correlated_artists = await Artist.find({genres: artist.genres, _id: {$ne: artist._id}}).sort({artist_name: 1}).limit(10);

        artist.events = events;
        artist.correlated_artists = correlated_artists;
        res.render('artist', {artist});  
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors: err });
    }
};

module.exports.getArtistByNameLike = async (req, res) => {
    try {
        if(req.query.name == undefined) {
            res.status(400).json({ errors: "No name specified" });
        }
        const artists = await Artist.find({artist_name: {$regex: req.query.name, $options: 'i'}}).limit(10);
        res.status(200).json({artists: artists});
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors: err });
    }
};
