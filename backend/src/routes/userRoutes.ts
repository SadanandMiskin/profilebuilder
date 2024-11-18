import { Router } from 'express';
import { createUser, getUserByUsername, updateUser, deleteUser } from '../controllers/userController';
import { upload } from '../middleware/uploadMiddleware';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.post('/', isAuthenticated, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'backgroundMedia', maxCount: 1 }
]), createUser);
router.get('/:username', getUserByUsername);
router.put('/:username', isAuthenticated, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'backgroundMedia', maxCount: 1 }
]), updateUser);
router.delete('/:username', isAuthenticated, deleteUser);

export default router;