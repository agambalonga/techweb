const { Router }  = require('express');

module.exports.getCheckout = (req, res) => {

    let total = 0;

    if(typeof req.session.cart !== "undefined" && req.session.cart.length > 0) {

        req.session.cart.forEach(item => {
            total += item.event_price * item.event_quantity;
        });

    }
    
    res.render('checkout', {total: total});
}

module.exports.postCheckout = (req, res) => {
}