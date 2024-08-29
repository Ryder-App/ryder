import { Router } from 'express';
import { auth } from '../../middleware/authorization';
import { upload } from '../../middleware/upload';
import {
  registerRyder,
  getRiderDetails,
  loginRyder
} from '../../controllers/riderControllers';
import editRiderProfile from '../../controllers/riderControllers/editRiderProfile';

const router = Router();

router.post('/register-rider', upload, registerRyder);
router.post("/rider-login", loginRyder);
router.get('/get-riders', auth, getRiderDetails);
router.put('/edit-rider-profile/:userId', auth, editRiderProfile);

export default router;
