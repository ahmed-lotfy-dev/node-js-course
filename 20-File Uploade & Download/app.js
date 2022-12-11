import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import { mongoose } from "mongoose"
import session from "express-session"
import connectMongo from "connect-mongodb-session"
import csrf from "csurf"
import flash from "connect-flash"


import { get404, get500 } from './controllers/error.js';
import User from './models/user.js';

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js'

const app = express();
const MongoStore = connectMongo(session)
const store = new MongoStore({
  uri: process.env.MONGO_URI_SESSION,
  collection: 'sessions'
})

const csrfProtection = csrf()

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({ secret: process.env.EXPRESS_SESSION_SECRET, resave: false, saveUninitialized: false, store: store }))

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user
      next()
    })
    .catch(err => {
      next(new Error(err))
    });
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.get('/500', get500)

app.use(get404)

app.use((error, req, res, next) => {
  // res.redirect('/500')
  res.status(500).render('500', {
    pageTitle: 'Error Occured',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
})

mongoose.connect(process.env.MONGO_URI)
  .then(result => {
    app.listen(process.env.PORT)
    console.log(`Server Started & Listening To Port http://localhost:${process.env.PORT}`)
    console.log('Connected To Db')
  }).catch(err => {
    console.log(err)
  })