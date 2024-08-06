import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CustomError } from "../errors/custom.error";

export class AuthController {
    public static async signUp(req: Request, res: Response): Promise<void> {
        const { userName, email, password } = req.body
        try {
            const result = await AuthService.signUp(userName, password, email);
            console.log(111, result)
            res.status(201).send(result);
        } catch (error) {
            if (error instanceof CustomError) {
                console.log("serialaize", error.serializeErrors())
                res.status(error.statusCode).send({ errors: error.serializeErrors() });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        }
    }

    public static async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const tokens = await AuthService.signIn(email, password);
            if (tokens) {
                res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1 * 24 * 60 * 60 * 1000 });
                res.status(200).send({ accessToken: tokens?.accessToken });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send();
        }
    }

    public static async signOut(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token not provided' });
        }
        try {
            await AuthService.signOut(refreshToken);
            res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    }

    public static async refreshToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token not provided' });
        }
        try {
            const tokens = await AuthService.refreshToken(refreshToken);
            if (tokens) {
                res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 1 * 24 * 60 * 60 * 1000 });
                res.status(200).send({ accessToken: tokens?.accessToken });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    }

    public static async getMe(req: Request, res: Response): Promise<void> {
        const userId = (req as any).userId;
        try {
            const user = await AuthService.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.json(user);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}