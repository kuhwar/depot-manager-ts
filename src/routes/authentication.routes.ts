import { Router } from 'express';
import {googleAuthenticatorCallbackController, googleAuthenticatorController, logoutContoller, loginContoller} from "../middlewares/authentication.middlewares";
const router = Router();

router.get('/login',loginContoller)
router.get('/google', googleAuthenticatorController );
router.get('/google/callback', googleAuthenticatorCallbackController);
router.get('/logout', logoutContoller);

export default router