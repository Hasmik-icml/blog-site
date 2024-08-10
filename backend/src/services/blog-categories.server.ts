import { Category, Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../handlers/not-found.handler";

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
            where: { id, deletedAt: null },
        })
    }
    
    public static async update(id: number, name?: string): Promise<Category> {
        try {
            const updatedCategory = await this.repo.update({
                where: {
                    id,
                    deletedAt: null,
                },
                data: { name },
            });

            return updatedCategory;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError('Category not found');
            }
            throw new Error('Error updating Category');
        }

    }

    public static async delete(id: number): Promise<Category> {
        const existingCategory = await this.repo.findUnique({
            where: { id, deletedAt: null },
        });

        if (!existingCategory) {
            throw new NotFoundError("Category not found");
        }

        const deletedCategory = await this.repo.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return deletedCategory;
    }
}