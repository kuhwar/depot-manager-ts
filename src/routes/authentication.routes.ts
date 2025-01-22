import { Router } from 'express';
import {googleAuthenticatorCallbackController, googleAuthenticatorController, logoutController, loginController} from "../middlewares/authentication.middlewares";
const router = Router();

router.get('/login',loginController)
router.get('/google', googleAuthenticatorController );
router.get('/google/callback', googleAuthenticatorCallbackController);
router.get('/logout', logoutController);

export default router