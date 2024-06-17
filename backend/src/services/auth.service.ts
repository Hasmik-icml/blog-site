import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BadRequestError } from "../handlers/badrequestError.handler";

export class AuthService {
    private static prismaClient = new PrismaClient();

    private static get repo() {
        return this.prismaClient.user;
    }

    public static async signUp(userName: string, password: string, email: string): Promise<User | undefined | Error> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user: User | null = await this.repo.findUnique({ where: { email } });
            if (user) {
                throw new BadRequestError("User already exists");
            }
            const userCreated: User = await this.repo.create({
                data: {
                    name: userName,
                    email: email,
                    password: hashedPassword,
                }
            });
            return userCreated;
        } catch (error) {
            console.log(555, error)
            return new BadRequestError("User already exists");
        }
    }

    public static async signIn(userName: string, password: string, email: string): Promise<void> {
        try {

        } catch (error) {

        }
    }

    public static async signOut(userName: string, password: string, email: string): Promise<void> {
        try {

        } catch (error) {

        }
    }
}