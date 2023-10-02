const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
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
        required : [true, 'Password is not provided. Please provide a password']
    },
    phone_number : {
        type : String,
        required : [true, 'Phone number is not provided. Please provide a telephone']
    }
 });

 userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
 });

 userSchema.statics.login = async function(email, password) {
        const user = await this.findOne({email});
        if(user) {
            const auth = await bcrypt.compare(password, user.password);
            if(auth) {
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect email');
    }



 const User = mongoose.model('users', userSchema);

 module.exports = User;