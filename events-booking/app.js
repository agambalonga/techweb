const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const artistRoutes = require('./routes/artistRoutes');
const cartRoutes = require('./routes/cartRoute');
const checkoutRoutes = require('./routes/checkoutRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const cookieParser = require('cookie-parser');
const {checkAuth} = require('./middleware/authMiddleware');
const {checkUser} = require('./middleware/authMiddleware');
const eventController = require('./controller/eventController');
const indexController = require('./controller/indexController');
const sessions = require('express-session');

const app = express();

// middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGO_ATLAS_URL)
.then((result) => {
  console.log("connected to db");
  app.listen('3000','0.0.0.0');
  console.log("app listening on port 3000");
})
.catch((err) => console.log("error "+ err));

// routes
app.get('*', checkUser, (req, res, next) => {
    res.locals.cart = req.session.cart;
    next();
});
app.get('/', indexController.get_index);

app.get('/home', checkAuth, eventController.get_events);

app.use(authRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(artistRoutes);
app.use(cartRoutes);
app.use(checkoutRoutes);
app.use(ticketRoutes);

