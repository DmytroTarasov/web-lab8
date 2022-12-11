import { Router } from 'express';
import { createProfile, login, getProfileInfo, 
  editProfileInfo, deleteProfile} from '../controllers/auth-controller.js';
import checkAuth from '../middlewares/auth-middleware.js';

const router = Router();

router.post('/register', createProfile);
router.post('/login', login);

router.use(checkAuth);

router.get('/profileInfo', getProfileInfo);
router.patch('/editProfile', editProfileInfo);
router.delete('/deleteProfile', deleteProfile);

export default router;