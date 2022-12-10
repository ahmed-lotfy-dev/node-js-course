import crypto from "crypto"
import bcrypt from "bcryptjs"
import User from "../models/user.js";
import nodemailer from 'nodemailer'
import * as validator from 'express-validator'
import sendgridTransport from 'nodemailer-sendgrid-transport'

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "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"
    }
  })
);

const { validationResult } = validator

export function getLogin(req, res, next) {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

export function postLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
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
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
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
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrorse: []
  });
};

export function postSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
}

export function getReset(req, res, next) {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

export function postReset(req, res, next) {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      res.redirect('reset')
      console.log(err)
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No Account With This Email ')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then(result => {
        res.redirect('/')
        transporter.sendMail({
          to: req.body.email,
          from: 'contact@ahmedlotfy.me',
          subject: 'Reset Password !',
          html: `
          <p>You Requested Password Reset</p>
          <p>Click this <a href="{{http://localhost:3000/reset/${token}}}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => console.log(err))
  })
}

export function getNewPassword(req, res, next) {
  const token = req.params.token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error')
      if (message.length > 0) {
        message = message[0]
      } else {
        message = null
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        passwordToken: token,
        userId: user._id.toString()
      })
    })
    .catch(err => console.log(err))
}

export function postNewPassword(req, res, next) {
  const { userId, newPassword, passwordToken } = req.body
  let resetUser;
  User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
      resetUser = user
      return bcrypt.hash(newPassword, 12)
    }).then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined
      return resetUser.save()
    })
    .then(result => {
      res.redirect('/login')
    })
    .catch(err => console.log(err))
}
