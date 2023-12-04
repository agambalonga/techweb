const { Router }  = require('express');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();
var fs = require('fs');
const bcrypt = require('bcrypt');


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
    return jwt.sign({id}, process.env.JWT_SECRET , {
        expiresIn: maxAge
    });
};

const getLastFourNumberOfCard = (cardNumber) => {
    return 'XXXX XXXX XXXX ' + cardNumber.substring(cardNumber.length - 4, cardNumber.length);
}



module.exports.signup_get = (req, res) => {res.render('signup')};

module.exports.login_get = (req, res) => {res.render('login')};

module.exports.signup_post = async (req, res) => {
    console.log(req.body);
    const { name, surname, email, password, phone_number, birth_date, profile_pic, sex, address_line, nationality } = req.body;
    console.log('profile pic '+ profile_pic);
    try {
        var profile_pic_URL = null;

        if(profile_pic) {
            profile_pic_URL = "/uploads/" + profile_pic;
        }

        const salt = await bcrypt.genSalt();
        const password_hashed = await bcrypt.hash(password, salt);

        const user = await User.create({name, surname, email, password: password_hashed, phone_number, birth_date, profile_pic_URL, sex, address_line, nationality});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    } catch (err) {
        if(profile_pic_URL) {
            fs.unlinkSync('public' + profile_pic_URL);
        }
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
        let user = await User.findOne({google_id: userInfo.sub});
        if(!user) {
            console.log('user not found by googleId. Checking if user is already registered with email ' + userInfo.email);
            user = await User.findOne({email: userInfo.email});
            if(!user) {
                console.log('user not registered. Creating new user by googleId');
                user = await User.create({name: userInfo.given_name, surname: userInfo.family_name, email: userInfo.email, google_id: userInfo.sub, profile_pic_URL: userInfo.picture});
            } else {
                console.log('user already registered with email '+ userInfo.email + '. Ready to link google account'+ userInfo.sub);
                const result = await User.updateOne({email: userInfo.email}, {$set: {google_id: userInfo.sub, profile_pic_URL: userInfo.picture}});
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
    console.log('/profile/'+ req.params.id +' called...');
    let user = await User.findOne({_id: req.params.id});
    res.render('profile', {user});
}

module.exports.update_profile = async (req, res) => {
    console.log('updating user with id: '+ req.params.id);
    console.log('updating user with data: '+ JSON.stringify(req.body));
    
    //find user by id and update
    let userRetrieved = await User.findOne({_id: req.params.id});

    var old_profile_pic_URL = userRetrieved.profile_pic_URL;
    var updatePic = false;
    
    userRetrieved.name = req.body.name;
    userRetrieved.surname = req.body.surname;
    userRetrieved.email = req.body.email;
    userRetrieved.birth_date = req.body.birth_date;
    userRetrieved.phone_number = req.body.phone_number;
    userRetrieved.sex = req.body.sex;
    userRetrieved.address_line = req.body.address_line;
    userRetrieved.nationality = req.body.nationality;

    if(!old_profile_pic_URL || (old_profile_pic_URL && req.body.profile_pic_URL && old_profile_pic_URL != req.body.profile_pic_URL)) {
        userRetrieved.profile_pic_URL = req.body.profile_pic_URL;
        updatePic = true;
    }
    
    if(userRetrieved.password && req.body.old_password && req.body.new_password) {
        console.log('updating password');
        const auth = await User.comparePassword(userRetrieved.password, req.body.old_password);
        if(auth) {
            console.log('old password correct');

            const salt = await bcrypt.genSalt();
            const new_password = await bcrypt.hash(req.body.new_password, salt);

            userRetrieved.password = new_password;
        } else {
            console.log('incorrect old password');
            
            if(updatePic && fs.existsSync('public' + userRetrieved.profile_pic_URL))
                fs.unlinkSync('public' + userRetrieved.profile_pic_URL);

            res.status(400).send({ errors: {old_password: 'Incorrect old password'} });
            return;
        }
    }

    try {
        const user = await userRetrieved.save();
        console.log('user updated successfully');

        if(updatePic && fs.existsSync('public' + old_profile_pic_URL) && old_profile_pic_URL != userRetrieved.profile_pic_URL) {
            console.log('deleting old profile pic');
            fs.unlinkSync('public' + old_profile_pic_URL);
        }

        res.status(200).json({user: user});
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        if(updatePic && fs.existsSync('public' + userRetrieved.profile_pic_URL) && old_profile_pic_URL != userRetrieved.profile_pic_URL) {
            console.log('deleting old profile pic');
            fs.unlinkSync('public' + userRetrieved.profile_pic_URL);
        }
        res.status(400).send({ errors });
    }
}

module.exports.get_wallet = async (req, res) => {
    console.log('retrieving user with id: '+ req.params.id);
    let user = await User.findOne({_id: req.params.id});
    console.log('user retrieved: '+ user);
    res.render('wallet', {user});
}

module.exports.add_wallet = async (req, res) => {
    console.log('updating user with id: '+ req.params.id);
    console.log('updating user with data: '+ JSON.stringify(req.body));
    
    //find user by id and update
    let userRetrieved = await User.findOne({_id: req.params.id});
    
    userRetrieved.wallet = userRetrieved.wallet + parseFloat(req.body.amount);
    userRetrieved.transactions.push({date: new Date(), description: 'Deposit from card '+ getLastFourNumberOfCard(req.body.card_number), sign: '+', amount: parseFloat(req.body.amount)});

    
    try {
        const user = await userRetrieved.save();
        console.log('user updated successfully');
        res.status(200).json({curr_wallet: user.wallet, transaction: user.transactions[user.transactions.length - 1]});
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
}

