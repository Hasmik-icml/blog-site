import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    public static async signUp(req: Request, res: Response): Promise<void> {
        const { userName, email, password } = req.body
        try {
            const result = await AuthService.signUp(userName, password, email);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }
    public static async signIn() { }
    public static async signOut() { }
}