import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import { mongoose } from "mongoose"
import session from "express-session"
import MongoDBStore from "connect-mongodb-session"
import csrf from "csurf"
import flash from "connect-flash"
import multer from "multer"

import { get404, get500 } from './controllers/error.js';
import User from './models/user.js';

const app = express();
const MongoStore = MongoDBStore(session)
const store = new MongoStore({
  uri: process.env.MONGO_URI_SESSION,
  collection: 'sessions'
})

const csrfProtection = csrf()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {

    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js'

app.use(express.urlencoded({ extended: true }))
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static('public'))
app.use('/images',express.static('images'))
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
})
)

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

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