const { Router }  = require('express');
const Event = require('../model/Event');
const Artist = require('../model/Artist');

module.exports.get_index = async (req, res) => {
    try {
        // Limita la ricerca a 10 eventi, selezionando solo quelli che hanno una data maggiore o uguale a quella attuale e ci sono posti disponibili ordinando per data
        const events = await Event.find({date: {$gte: new Date()}, seats: {$gt: 0}}).sort({date: 1}).limit(10);

        // Cerca gli artisti che hanno più eventi in programma e li ordina per numero di eventi
        const artists = await Artist.aggregate([
            {
                $lookup: {
                    from: "events",
                    localField: "_id",
                    foreignField: "artist._id",
                    as: "events"
                }
            },
            {
                $project: {
                    _id: 1,
                    artist_name: 1,
                    image_URL: 1,
                    num_events: { $size: "$events" }
                }
            },
            {
                $sort: { num_events: -1 }
            }
        ]);

        console.log(artists);

        res.render('index', {events, artists});
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};