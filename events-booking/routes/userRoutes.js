const Router = require('express').Router;
const router = new Router();
const { checkAuth } = require('../middleware/authMiddleware');
const userController = require('../controller/userController');
const saveFile = require('../middleware/multerMiddleware');


router.get('/user/:id', checkAuth, userController.get_profile);

router.put('/user/:id', checkAuth, saveFile, userController.update_profile);

router.get('/user/:id/wallet', checkAuth, userController.get_wallet);

router.post('/user/:id/wallet', checkAuth, userController.add_wallet);

router.get('/user/:id/events', checkAuth, userController.get_events_booked);

module.exports = router;
