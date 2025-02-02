import { Router } from 'express';
import {googleAuthenticatorCallbackController, googleAuthenticatorController, logoutController, loginController} from "../controllers/authentication.middlewares";
const router = Router();

router.get('/login',loginController)
router.get('/google', googleAuthenticatorController );
router.get('/google/callback', googleAuthenticatorCallbackController);
router.get('/logout', logoutController);

export default router