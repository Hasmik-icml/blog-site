import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "./error.handler";
import { AuthController } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";


const router: Router = Router();
router
    .post('/signup',
        [
            body('userName').trim().escape().isLength({ min: 3, max: 25 }).isString().withMessage("Invalid username"),
            body('email').trim().escape().isEmail().withMessage("Invalid email"),
            body('password')
                .trim()
                .isLength({ min: 8 })
                .isStrongPassword({
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0
                }).withMessage("Invalide password"),
        ],
        validateRequest,
        AuthController.signUp
    )
    .post('/signin',
        [
            body('email').trim().escape().isEmail().withMessage("Invalid email"),
            body('password')
                .trim()
                .isLength({ min: 8 })
                .isStrongPassword({
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0
                }).withMessage("Invalide password"),
        ],
        validateRequest,
        AuthController.signIn
    )
    .post('/signout', AuthController.signOut)
    .post('/refresh-token', AuthController.refreshToken)
    .get('/me', authMiddleware, AuthController.getMe);




export { router as authRouter }