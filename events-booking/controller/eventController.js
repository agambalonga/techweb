const { Router }  = require('express');
const Event = require('../model/Event');

//Funzione che prende tutti gli eventi che sono disponibili ancora (dalla data attuale in poi)
//forse da eliminare
module.exports.get_events = async (req, res) => {
    try {
        //limita la ricerca a 10 eventi, selezionando solo quelli che hanno una data maggiore o uguale a quella attuale e ci sono posti disponibili ordinando per data
        const events = await Event.find({date: {$gte: new Date()}, seats: {$gt: 0}}).sort({date: 1}).limit(10);
        
        res.render('index', {events});
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};


module.exports.get_event = async (req, res) => {
    try {
        const event = await Event.findOne({_id: req.params.id});
        res.render('event', {event});
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};


