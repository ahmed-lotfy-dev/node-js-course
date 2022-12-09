import { Router } from 'express';

import { getLogin, postLogin, postLogout, postSignup, getSignup } from '../controllers/auth.js';

const router = Router();

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.post('/signup', postSignup);

export default router;