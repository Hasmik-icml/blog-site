import { Category, PrismaClient } from "@prisma/client";

export class BlogCategoryService {
    private static prismaClient = new PrismaClient;

    private static get repo() {
        return this.prismaClient.category;
    }

    public static async create(categoryName: string): Promise<Category> {
        return this.repo.create({
            data: { name: categoryName },
        });
    }

    public static async getAll(): Promise<Category[]> {
        return await this.repo.findMany({
            where: { deletedAt: null },
        });
    }

    public static async getById(id: number): Promise<Category> {
        return this.repo.findUniqueOrThrow({
            where: { id },
        })
    }
    public static async update(id: number, name?: string): Promise<Category> {
        return this.repo.update({
            where: {
                id
            },
            data: { name },
        });
    }

    public static async delete(id: number): Promise<Category> {
        const existingCategory = await this.repo.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            throw new Error("");
        }

        const deletedCategory = await this.repo.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return deletedCategory;
    }
}