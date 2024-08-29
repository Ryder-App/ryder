import { Router } from 'express';
import { auth } from '../../middleware/authorization';
import { upload } from '../../middleware/upload';
import {
  registerRyder,
  getRiderDetails,
  login,
  editRiderProfile,
} from '../../controllers/riderControllers';

const router = Router();

router.post('/registerRider', upload, registerRyder);
router.post('/login', login);
router.get('/getRiders', auth, getRiderDetails);
router.put('/editriderprofile/:userId', auth, editRiderProfile);

export default router;
