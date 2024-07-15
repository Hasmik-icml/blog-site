import { Blog, PrismaClient } from "@prisma/client";

interface BlogUpdateData {
    title?: string;
    content?: string;
    image?: string;
    tags?: string[];
    categories?: {
        connect: { id: number }[];
    }
}

export class BlogService {
    private static prismaClient = new PrismaClient;

    private static get repo() {
        return this.prismaClient.blog;
    }

    public static async createBlog(title: string, content: string, userId: string, image: string, tags: string[], categoryId: number): Promise<Blog | undefined> {
        try {
            return await this.repo.create({
                data: {
                    title, content, authorId: userId, image, tags,
                    categories: {
                        connect: { id: categoryId }
                    },
                },
                include: {
                    categories: true,
                }
            });
        } catch (error) {
            console.log(error);
        }

    }

    public static async getAllBlogs(): Promise<Blog[]> {
        return await this.repo.findMany();
    }

    public static async getBlogById(id: number): Promise<Blog | null> {
        return await this.repo.findUnique({
            where: { id },
        });
    }

    public static async updateBlog(id: number, title?: string, content?: string, image?: string, tags?: string[], categoryId?: number): Promise<Blog | null | undefined> {
        try {
            const data: BlogUpdateData = {
                title, content, image, tags,
            };

            if (categoryId) {
                await this.repo.update({
                    where: { id },
                    data: {
                        categories: {
                            set: []
                        }
                    }
                });

                data.categories = {
                    connect: [{ id: categoryId }],
                }
            }

            await this.repo.update({
                where: { id },
                data,
            });

            return await this.repo.findUnique({
                where: { id },
                include: { categories: true }
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