const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const artistRoutes = require('./routes/artistRoutes');
const cookieParser = require('cookie-parser');
const {checkAuth} = require('./middleware/authMiddleware');
const {checkUser} = require('./middleware/authMiddleware');
const {v4: uuidv4} = require('uuid');

const app = express();

// middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGO_ATLAS_URL)
.then((result) => {
  console.log("connected to db");
  app.listen(3000)
  console.log("app listening on port 3000");
})
.catch((err) => console.log("error "+ err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
app.get('/home', checkAuth, (req, res) => res.render('home'));
app.use(authRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(artistRoutes);
