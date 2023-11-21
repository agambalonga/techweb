const { Router }  = require('express');
const cartController = require('../controller/cartController');


const router = new Router();

router.post('/cart/add', cartController.add_to_cart);

module.exports = router;    