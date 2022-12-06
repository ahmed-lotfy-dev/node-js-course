import { Router } from 'express';

import { getIndex, getProducts, getProduct, postCart, getCart, postCartDeleteProduct, postOrder, getOrders } from '../controllers/shop.js';

const router = Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postCartDeleteProduct);

router.post('/create-order', postOrder);

router.get('/orders', getOrders);

export default router;
