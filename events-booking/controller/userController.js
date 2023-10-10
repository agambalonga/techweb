const { Router }  = require('express');
const User = require('../model/User');
const jwt = require('jsonwebtoken');


//handle errors
const handleErrors = (err) => {
    let errors = {};

    //handle duplicated key mongo
    if(err.code === 11000) {
        errors.email = 'Email already registered';
        return errors;
    }

    if(err.message === 'User not registered with email. Please login with Google') {
        errors.email = 'User not registered with email. Please login with Google';
        return errors;
    }

    if(err.message === 'incorrect email') {
        errors.email = 'Email not registered';
    }

    if(err.message === 'incorrect password') {
        errors.password = 'Incorrect password';
    }

    if(err.message.includes('users validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 15 * 60;

const createToken = (id) =>{
    return jwt.sign({id}, 'techweb secret', {
        expiresIn: maxAge
    });
};



module.exports.signup_get = (req, res) => {res.render('signup')};

module.exports.login_get = (req, res) => {res.render('login')};

module.exports.signup_post = async (req, res) => {
    const { name, surname, email, password, phone_number, birth_date } = req.body;
    try {
        const user = await User.create({name, surname, email, password, phone_number, birth_date});
        console.log('user '+ user._id +' created successfully');
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        console.log(errors)
        res.status(400).send({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        console.log('user logged in successfully');
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    } catch (err) {
        console.log(err)
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    console.log('user logged out successfully');
    res.redirect('/');
}

module.exports.login_google = async (req, res) => {
    const userInfo = jwt.decode(req.body.credential);
    try {
        let user = await User.findOne({googleId: userInfo.sub});
        if(!user) {
            console.log('user not found by googleId. Checking if user is already registered with email ' + userInfo.email);
            user = await User.findOne({email: userInfo.email});
            if(!user) {
                console.log('user not registered. Creating new user by googleId');
                user = await User.create({name: userInfo.given_name, surname: userInfo.family_name, email: userInfo.email, googleId: userInfo.sub});
            } else {
                console.log('user already registered with email '+ userInfo.email + '. Ready to link google account');
                const result = await User.updateOne({email: userInfo.email}, {$set: {googleId: userInfo.sub}});
            }
        }

        console.log('user logged in successfully');
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});

    } catch (err) {
        console.log(err);
    }
}

module.exports.get_profile = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        res.locals.user = user;
        res.render('profile');
    } catch (err) {
        console.log(err);
    }
}