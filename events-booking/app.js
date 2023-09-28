const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const accountController = require('./controller/accountController');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGO_ATLAS_URL)
.then((result) => {
  console.log("connected to db");
  app.listen(3000)
})
.catch((err) => console.log("error "+ err));

// routes
app.get('/', (req, res) => res.render('index'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(accountController);