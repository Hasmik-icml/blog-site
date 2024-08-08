import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BadRequestError } from "../handlers/bad-request.handler";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY || "";
const refresh_key = process.env.JWT_REFRESH_KEY || "";

interface ITokens {
    accessToken: string;
    refreshToken: string;
}

interface IUser {
    id: string;
    email: string;
    name: string | null;
}

export class AuthService {
    private static prismaClient = new PrismaClient();

    private static get repo() {
        return this.prismaClient.user;
    }

    public static async signUp(userName: string, password: string, email: string): Promise<IUser | undefined | Error> {
        // try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const selectFields = { "id": true, "email": true, "name": true };

            const user: User | null = await this.repo.findUnique({ where: { email } });
            if (user) {
                throw new BadRequestError("User already exists");
            }
            const userCreated: IUser = await this.repo.create({
                data: {
                    name: userName,
                    email: email,
                    password: hashedPassword,
                },
                select: selectFields,
            });
            return userCreated;
        // } catch (error) {
        //     console.log(555, error)
        //     return new BadRequestError("User already exists");
        // }
    }

    public static async signIn(email: string, password: string): Promise<ITokens | undefined> {
        try {
            const user = await this.repo.findUnique({ where: { email } });
            if (!user) {
                throw Error("Invalid email or password");
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw Error("222Invalid email or password");
            }

            const accessToken = jwt.sign(
                { userId: user.id, email: user.email },
                secretKey!,
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                { userId: user.id, email: user.email },
                refresh_key!,
                { expiresIn: '1d' }
            );

            await this.repo.update({
                where: { id: user.id },
                data: { refreshToken },
            })

            return { accessToken, refreshToken };
        } catch (error) {
            console.log(error);
        }
    }

    public static async refreshToken(refreshToken: string): Promise<ITokens | undefined> {
        try {
            const decoded = jwt.verify(refreshToken, refresh_key!) as { userId: string, email: string };
            const user = await this.repo.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                throw Error('Invalid refresh token');
            }
            const accessToken = jwt.sign(
                { userId: user.id, email: user.email },
                secretKey!,
                { expiresIn: '15m' }
            );
            const newRefreshToken = jwt.sign(
                { userId: user.id, email: user.email },
                refresh_key!,
                { expiresIn: '1d' }
            );

            await this.repo.update({
                where: { id: user.id },
                data: { refreshToken: newRefreshToken },
            })

            return { accessToken, refreshToken: newRefreshToken };
        } catch (error) {
            console.log(error);
        }
    }

    public static async signOut(refreshToken: string): Promise<void> {
        try {
            const decoded = jwt.verify(refreshToken, refresh_key!) as { userId: string, email: string };
            await this.repo.update({
                where: { id: decoded.userId },
                data: { refreshToken: null }
            });
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Failed to logout');
        }
    }

    public static async getUserById(userId: string) {
        const selectFields = { "id": true, "email": true, "name": true };

        const user = await this.repo.findUnique({
            select: selectFields,
            where: { id: userId },
        });

        return user;
    }
}