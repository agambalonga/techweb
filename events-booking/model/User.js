const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        auto : true
    },
    name : {
        type : String
    },
    surname : {
        type : String
    },
    email : {
        type : String,
        unique : true,
        lowercase : true,
        validate: [isEmail, 'Email is not valid. Please enter a valid email']
    },
    birth_date : {
        type : Date
    },
    password : {
        type : String
    },
    phone_number : {
        type : String
    },
    google_id : {
        type : String
    },
    profile_pic_URL : {
        type : String
    },
    wallet: {
        type: Number,
        default: 0.0
    }
 });

 userSchema.pre(['save', 'update'], async function(next) {
    if(this.password) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
 });

 userSchema.statics.login = async function(email, password) {
        const user = await this.findOne({email});
        if(user) {
            if(!user.password) {
                throw Error('User not registered with email. Please login with Google');
            }
            const auth = await bcrypt.compare(password, user.password);
            if(auth) {
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect email');
    }


userSchema.statics.loginGoogle = async function(googleId) {
        const user = await this.findOne({google_id: googleId});
        return user;
    }

userSchema.statics.comparePassword = async function(password, oldPassword) {
    console.log('comparing password: '+ password + ' with oldPassword: '+ oldPassword);
    let auth=false;
    
    auth = await bcrypt.compare(oldPassword, password);

    if(auth) {
        return true;
    }
    return false;
}




 const User = mongoose.model('users', userSchema);

 module.exports = User;