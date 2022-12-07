import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import bodyParser from "body-parser";

import { mongoose } from "mongoose"
import { get404 } from './controllers/error.js';
import User from './models/user.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.use((req, res, next) => {
  User.findById('63906183ae6f9b1e3662a206')
    .then(user => {
      req.user = user
      next();
    })
    .catch(err => console.log(err));
});

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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
    console.log(`Server Started & Listening To Port ${process.env.PORT}`)
    console.log('Connected To Db')
  }).catch(err => {
    console.log(err)
  })