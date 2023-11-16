const { Router }  = require('express');
const artistController = require('../controller/artistController');


const router = new Router();

router.get('/artists', artistController.getAll);

router.get('/artist/:id', artistController.getArtistById);

module.exports = router;    