import User from "../models/user.js";

export function getLogin(req, res, next) {
  // const isLoggedIn = req.get('Cookie').split('=')[1]
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

export function postLogin(req, res, next) {
  User.findById('63906183ae6f9b1e3662a206')
    .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      req.session.save((err) => {
        console.log(err)
        res.redirect('/');
      })
    })
    .catch(err => console.log(err));
};

export function postLogout(req, res, next) {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
};
