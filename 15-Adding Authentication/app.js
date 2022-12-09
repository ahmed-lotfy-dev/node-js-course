import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import { mongoose } from "mongoose"
import session from "express-session"
import connectMongo from "connect-mongodb-session"

import { get404 } from './controllers/error.js';
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

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({ secret: process.env.EXPRESS_SESSION_SECRET, resave: false, saveUninitialized: false, store: store }))

app.use((req, res, next) => {
  if(!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(get404)

mongoose.connect(process.env.MONGO_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Ahmed",
          email: 'ahmed@ahmed.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })

    app.listen(process.env.PORT)
    console.log(`Server Started & Listening To Port http://localhost:${process.env.PORT}`)
    console.log('Connected To Db')
  }).catch(err => {
    console.log(err)
  })