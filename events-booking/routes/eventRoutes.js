const Router = require('express').Router;
const router = new Router();
// const { checkAuth } = require('../middleware/authMiddleware');
const eventController = require('../controller/eventController');
// const saveFile = require('../middleware/multerMiddleware');


router.get('/event/', eventController.get_events);

module.exports = router;