const { Router }  = require('express');
const artistController = require('../controller/artistController');


const router = new Router();

router.get('/artists', artistController.getAll);

router.get('/artist/:id', artistController.getArtistById);

router.get('/artists/getArtistByNameLike', artistController.getArtistByNameLike);

module.exports = router;    