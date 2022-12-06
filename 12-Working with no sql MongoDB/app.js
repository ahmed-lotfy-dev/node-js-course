import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import bodyParser from "body-parser";

import { get404 } from './controllers/error.js';
import { mongoConnect } from './util/database.js';
import { User } from './models/user.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.use((req, res, next) => {
  User.findById('638f7d95f29dd7c464ce6790')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect(() => {
  app.listen(process.env.PORT)
})