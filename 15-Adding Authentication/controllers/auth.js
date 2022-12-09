import bcrypt from "bcryptjs"

import User from "../models/user.js";

export function getLogin(req, res, next) {
  let message = req.flash('error')
  console.log(message)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message[0]
  });
};

export function postLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

export function postLogout(req, res, next) {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
};

export function getSignup(req, res, next) {
  let message = req.flash('error')
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message[0]
  })
};

export function postSignup(req, res, next) {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email Already Exist, Choose Another One');
        res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return user.save()
        })
        .then(result => {
          console.log(result)
          res.redirect('/login')
        })
    })

    .catch(err => {
      console.log(err)
    })
}
