const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();

const maxAge = 15 * 60;

const checkAuth = (req, res, next)  => {
    //retrieve token from cookies
    const token = req.cookies.jwt;
    if(token){
        //verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                console.log("error: " + err.message);
                console.log(err.message);
                res.redirect('/login');
            } else {
                //refresh jwt token if is all ok
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {checkAuth, checkUser};