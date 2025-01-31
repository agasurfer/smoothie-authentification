const express = require('express');
const mongoose = require('mongoose');
const cookieParser= require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 3000
const {requireAuth, checkUser} = require('./middleware/authMiddleware');

require("dotenv").config();

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection

mongoose.connect(process.env.DB_URI)
.then(()=> console.log('Connected to MongoDB'))
.then((result) => app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
    
  }))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

