import { Router } from 'express';

import { getLogin, postLogin, postLogout, postSignup, getSignup, getReset, postReset, getNewPassword, postNewPassword } from '../controllers/auth.js';

const router = Router();

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.post('/signup', postSignup);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword)

router.post('/new-password', postNewPassword)

export default router;