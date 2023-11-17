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
    let artista={};
    let events =[];
    debugger;
    console.log(req.params.id);
    try {
        //find artist by id
        artista = await Artist.findById(req.params.id);
        events = await Event.find({ 'artist._id': artista._id });
        events.artist = artista;
        res.render('artist', {events: events});  
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors: err });
    }
};
