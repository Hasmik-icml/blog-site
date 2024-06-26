import { Blog, PrismaClient } from "@prisma/client";

export class BlogService {
    private static prismaClient = new PrismaClient;

    private static get repo() {
        return this.prismaClient.blog;
    }

    public static async createBlog(title: string, content: string, userId: string, image: string, tags: string[]): Promise<Blog> {
        return await this.repo.create({
            data: { title, content, authorId: userId, image, tags },
        });
    }

    public static async getAllBlogs(): Promise<Blog[]> {
        return await this.repo.findMany();
    }

    public static async getBlogById(id: number): Promise<Blog | null> {
        return await this.repo.findUnique({
            where: { id },
        });
    }

    public static async updateBlog(id: number, title?: string, content?: string, image?: string, tag?: string[]): Promise<Blog | null> {
        const data = { title, content, image, tag };
        console.log(111, data);
        return await this.repo.update({
            where: { id },
            data,
        });
    }

    public static async deleteBlog(id: number): Promise<Blog | null> {
        try {
            const existingBlog = await this.repo.findUnique({
                where: { id },
            });

            if (!existingBlog) {
                throw new Error("");
            }

            const deletedBlog = await this.repo.update({
                where: { id },
                data: { deletedAt: new Date() },
            });

            return deletedBlog;
        } catch (error) {
            throw new Error('Failed to delete');
        }
    }

}