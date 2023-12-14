const { Router }  = require('express');
const cartController = require('../controller/cartController');


const router = new Router();

router.post('/cart/add', cartController.check_seats, cartController.add_to_cart);

router.delete('/cart/delete', cartController.delete_from_cart);

module.exports = router;    