const { Router }  = require('express');
const userController = require('../controller/userController');
const saveFile = require('../authMiddleware/multerMiddleware');


const router = new Router();

router.get('/signup', userController.signup_get);

router.post('/signup', saveFile, userController.signup_post);

router.get('/login', userController.login_get);

router.post('/login', userController.login_post);

router.get('/logout', userController.logout_get);

router.post('/auth/google', userController.login_google);


module.exports = router;    