import { Router } from 'express';
import customerRoutes from './customers';
import riderRoutes from './riders';

const router = Router();

router.use('/customers', customerRoutes);
router.use('/riders', riderRoutes);

export default router;
