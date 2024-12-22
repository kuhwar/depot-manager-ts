import { Router } from 'express';
import {googleAuthenticatorCallbackController, googleAuthenticatorController, logoutContoller, loginContoller} from "../middlewares/authentication.middlewares";
const router = Router();

router.get('/auth/login',loginContoller)
router.get('/auth/google', googleAuthenticatorController );
router.get('/auth/google/callback', googleAuthenticatorCallbackController);
router.get('/logout', logoutContoller);

export = router