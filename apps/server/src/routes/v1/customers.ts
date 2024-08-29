import { Router } from 'express';
import {
  customerForgotPassword,
  loginCustomer,
  registerCustomer,
  customerResetPassword,
  verifyUser,
} from '../../controllers/customerControllers';

const router = Router();

router.post('/registerCustomer', registerCustomer);
router.post('/login', loginCustomer);
router.post('/forgotPassword', customerForgotPassword);
router.post('/resetPassword', customerResetPassword);
router.post('/verifyEmail', verifyUser);

export default router;
