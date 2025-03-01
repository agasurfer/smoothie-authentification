const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const {isEmail} = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required:  [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
})



//fire a function to hash password before doc saved to db
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//static method to login user
userSchema.statics.login = async function(email, password) {
    const user= await this.findOne({email})
    if(user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error("Incorrect password");
         
    }
    throw Error('Incorrect email')
}




const User = mongoose.model('user', userSchema)

module.exports = User