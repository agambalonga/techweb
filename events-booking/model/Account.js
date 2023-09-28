const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const accountSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name is not provided. Please provide a name'],
    },
    surname : {
        type : String,
        required : [true, 'Surname is not provided. Please provide a surname'],
    },
    email : {
        type : String,
        required : [true, 'Email is not provided. Please provide an email'],
        unique : true,
        lowercase : true,
        validate: [isEmail, 'Email is not valid. Please enter a valid email']
    },
    password : {
        type : String,
        required : [true, 'Password is not provided. Please provide a password'],
    },
 });

 accountSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
 });


 const Account = mongoose.model('accounts', accountSchema);

 module.exports = Account;