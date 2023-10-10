const jwt = require('jsonwebtoken');
const User = require('../model/User');

const maxAge = 15 * 60;

const checkAuth = (req, res, next)  => {
    console.log('checking authentication')
    //retrieve token from cookies
    const token = req.cookies.jwt;
    console.log("token: " + token);
    if(token){
        //verify token
        jwt.verify(token, 'techweb secret', (err, decodedToken) => {
            if(err){
                console.log("error: " + err.message);
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
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
        jwt.verify(token, 'techweb secret', async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
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