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
                title: event.title,
                price: event.price_for_ticket,
                event_img: event.image_URL,
                quantity: req.body.qty,
            });
        } else {
            for(let i = 0; i < req.session.cart.length; i++) {
                if(req.session.cart[i].event_id == event_id) {
                    newItem = false;
                    req.session.cart[i].quantity += req.body.qty;
                    break;
                }
            }
            
            if(newItem) {
                req.session.cart.push({
                    event_id: event_id,
                    title: event.title,
                    price: event.price_for_ticket,
                    event_img: event.image_URL,
                    quantity: req.body.qty,
                });
            }
        }


        console.log(req.session.cart);

        res.status(200).json({success: true, message: 'Event added to cart', newItem: newItem});
        


    } else {
        res.status(400).json({success: false, message: 'Event not found'});
    }
};