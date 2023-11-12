const { Router }  = require('express');
const Event = require('../model/Event');
var ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();
var fs = require('fs');

//Funzione che prende tutti gli eventi che sono disponibili ancora (dalla data attuale in poi)
module.exports.get_events = async (req, res) => {
    try {
        Event.find({date : { $gte: Date.now() }}, function(err, events) {
            res.render('home_prova', {events : events});  
          });
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

