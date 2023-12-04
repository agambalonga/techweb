const { Router }  = require('express');
const Event = require('../model/Event');


module.exports.add_to_cart = async (req, res) => {
    const event_id = req.body.event_id;
    const event = await Event.findById(event_id);

    let newItem = true;

    if(event) {

        if(typeof req.session.cart == "undefined") {
            newItem = true;
            req.session.cart = [];
            req.session.cart.push({
                event_id: event_id,
                event_title: event.title,
                artist_name: event.artist.name,
                event_price: event.price_for_ticket,
                event_img: event.image_URL,
                event_quantity: req.body.qty,
                event_city: event.city,
                event_date: event.formatDate(event.date),
            });
        } else {
            var updatedItem = {};
            for(let i = 0; i < req.session.cart.length; i++) {
                if(req.session.cart[i].event_id == event_id) {
                    newItem = false;
                    req.session.cart[i].event_quantity += req.body.qty;
                    updatedItem = req.session.cart[i];
                    break;
                }
            }

            if(newItem) {
                req.session.cart.push({
                    event_id: event_id,
                    event_title: event.title,
                    artist_name: event.artist.name,
                    event_price: event.price_for_ticket,
                    event_img: event.image_URL,
                    event_quantity: req.body.qty,
                    event_city: event.city,
                    event_date: event.formatDate(event.date),
                });
            }
        }

        res.status(200).json({success: true, message: 'Event added to cart', qty_added: req.body.qty, cart: req.session.cart, new_item: newItem, updated_item: updatedItem});
    
    } else {
        res.status(400).json({success: false, message: 'Event not found'});
    }
};


module.exports.delete_from_cart = async (req, res) => {
    const event_id = req.query.event_id;

    if(typeof req.session.cart != "undefined") {
        for(let i = 0; i < req.session.cart.length; i++) {
            if(req.session.cart[i].event_id == event_id) {
                req.session.cart.splice(i, 1);
                break;
            }
        }
    }

    res.status(200).json({success: true, message: 'Event deleted from cart', cart: req.session.cart});
};

//Funzione che controlla se l'evento ha ancora posti disponibili
module.exports.check_seats = async (req, res, next) => {
    console.log(req.body);
    const event_id = req.body.event_id;
    try {
        const event = await Event.findById(event_id);
        if(event.seats > 0 && event.seats >= req.body.qty){
            next();
        }else{
            res.status(400).json({success: false, code:'EB001', message: 'Seats not available for quantity selected'});
        }
    } catch (err) {
        console.log(err)
        // const errors = handleErrors(err);
        res.status(400).json({ err });
    }
};