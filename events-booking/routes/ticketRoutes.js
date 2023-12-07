const { Router }  = require('express');
const ticketController = require('../controller/ticketController');
const { checkAuth } = require('../middleware/authMiddleware');

const router = new Router();

router.get('/ticket/:id', checkAuth, ticketController.get_ticket);


module.exports = router;