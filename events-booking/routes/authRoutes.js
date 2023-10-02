const { Router }  = require('express');
const accountController = require('../controller/accountController');

const router = new Router();

router.get('/signup', accountController.signup_get);

router.post('/signup', accountController.signup_post);

router.get('/login', accountController.login_get);

router.post('/login', accountController.login_post);

router.get('/logout', accountController.logout_get);

module.exports = router;    