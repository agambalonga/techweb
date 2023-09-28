const { Router }  = require('express');
const Account = require('../model/Account');


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



const router = new Router();

router.get('/signup', (req, res) => {res.render('signup')});

router.post('/signup', async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        const account = await Account.create({name, surname, email, password});
        res.status(201).json(account);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
});

router.get('/login', (req, res) => {res.render('login')});

router.post('/login', (req, res) => {res.send('user login')});

module.exports = router;