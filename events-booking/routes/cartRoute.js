const { Router }  = require('express');
const cartController = require('../controller/cartController');


const router = new Router();

router.post('/cart/add', cartController.check_seats, cartController.add_to_cart);

router.delete('/cart/remove/:event_id', cartController.remove_from_cart);

module.exports = router;    