import { Router } from 'express';
import {
  customerForgotPassword,
  loginCustomer,
  registerCustomer,
  customerResetPassword,
  verifyUser,
} from '../../controllers/customerControllers';

const router = Router();

router.post('/register-customer', registerCustomer);
router.post('/customer-login', loginCustomer);
router.post('/forgot-password', customerForgotPassword);
router.post('/reset-password', customerResetPassword);
router.post('/verify-email', verifyUser);

export default router;
