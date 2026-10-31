import { Router } from 'express';
import * as controller from '../controllers/productController';

const router = Router();

router.get('/', controller.listProducts);
router.get('/:id', controller.getProduct);
router.post('/', controller.createProduct);

export default router;
