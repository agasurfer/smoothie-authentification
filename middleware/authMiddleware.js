const jwt = require('jsonwebtoken');
const User = require('../models/User')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    //check existence of token
    if (token) {
        jwt.verify(token, process.env.CSECRET, (err,decodedToken) => {
            if(err) {
                console.log(error.message);
                
                res.redirect('/login')
            } else {
                console.log(decodedToken);
                
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

//check current user

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
         jwt.verify(token, process.env.CSECRET, async (err,decodedToken) => {
            if(err) {
                console.log(error.message);
                res.locals.user = null;       //locals is used to give access to data tous middlewares and views
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser}