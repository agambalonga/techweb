const { Router }  = require('express');
const Account = require('../model/Account');
const jwt = require('jsonwebtoken');


//handle errors
const handleErrors = (err) => {
    let errors = {};

    //handle duplicated key mongo
    if(err.code === 11000) {
        errors.email = 'Email already registered';
        return errors;
    }

    if(err.message.includes('accounts validation failed')) {
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



const router = new Router();

router.get('/signup', (req, res) => {res.render('signup')});

router.post('/signup', async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        const account = await Account.create({name, surname, email, password});
        const token = createToken(account._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({account: account._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
});

router.get('/login', (req, res) => {res.render('login')});

router.post('/login', (req, res) => {res.send('user login')});

module.exports = router;