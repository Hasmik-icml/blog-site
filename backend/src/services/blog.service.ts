import { Blog, PrismaClient } from "@prisma/client";

export class BlogService {
    private static prismaClient = new PrismaClient;

    private static get repo() {
        return this.prismaClient.blog;
    }

    public static async createBlog(title: string, content: string, userId: string, image: string, tags: string[], categoryId: number): Promise<Blog> {
        return await this.repo.create({
            data: {
                title, content, authorId: userId, image, tags,
                categories: {
                    connect: { id: Number(categoryId) }
                },
            },
            include: {
                categories: true,
            }
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

    public static async updateBlog(id: number, title?: string, content?: string, image?: string, tag?: string[], categoryId?: number): Promise<Blog | null | undefined> {
        try {
            const data = {
                title, content, image, tag,
                categories: {
                    connect: { id: categoryId },
                },
                include: {
                    categories: true,
                }
            };
            console.log(111, data);
            return await this.repo.update({
                where: { id },
                data,
            });
        } catch (error) {
            console.log(error);
        }
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