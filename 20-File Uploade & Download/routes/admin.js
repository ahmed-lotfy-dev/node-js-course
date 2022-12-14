import { Router } from 'express';

import {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
} from '../controllers/admin.js';

import * as validator from 'express-validator'

import { isAuth } from '../middleware/is-auth.js'

const { body } = validator

const router = Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, getAddProduct);

// // /admin/products => GET
router.get('/products', isAuth, getProducts);

// // /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  postAddProduct
);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  postEditProduct
);

router.post('/delete-product', isAuth, postDeleteProduct);

export default router;
