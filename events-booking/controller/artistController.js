const { Router }  = require('express');
const Artist = require('../model/Artist');

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
    try {
        Artist.findById(req.params.id, function(err, artist) {
            res.status(200).json(artist);  
          });
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors: err });
    }
};
