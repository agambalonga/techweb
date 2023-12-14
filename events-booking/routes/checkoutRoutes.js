const Router = require('express').Router;
const { checkAuth } = require('../middleware/authMiddleware');
const checkoutController = require('../controller/checkoutController');


const router = new Router();

router.get('/checkout', checkAuth, checkoutController.getCheckout);
router.post('/checkout', checkAuth, checkoutController.postCheckout);

module.exports = router;