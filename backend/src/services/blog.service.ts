import { Blog, Category, PrismaClient } from "@prisma/client";
import { IBlogFilters } from "../helpers/filters-params.helper";

interface BlogUpdateData {
    title?: string;
    content?: string;
    image?: string;
    tags?: string[];
    categories?: {
        connect: { id: number }[];
    }
}

export interface ICategory {
    id: number;
    name: string;
}

export interface IOrderParams {
    orderField: string;
    order: 'asc' | 'desc';
}

export interface IBlogWithCategories extends Blog {
    categories: Category[];
}

export class BlogService {
    private static prismaClient = new PrismaClient;

    private static get repo() {
        return this.prismaClient.blog;
    }

    public static async createBlog(title: string, content: string, userId: string, image: string, tags: string[], category: ICategory): Promise<Blog | undefined> {
        try {
            const blog = await this.repo.create({
                data: {
                    title, content, authorId: userId, image, tags,
                    categories: {
                        connect: [
                            {
                                id: category.id,
                            }
                        ]
                    },
                },
                include: {
                    categories: true,
                }
            });
            return blog;
        } catch (error) {
            console.log(error);
        }

    }

    public static async getAllBlogs(page: number, limit: number, orderBy: string, order: string, filters: IBlogFilters): Promise<[data: IBlogWithCategories[], count: number]> {
        const skip = (page - 1) * limit;
        let [data, count]: [data: IBlogWithCategories[], count: number] = [[], 0];

        const where: any = { deletedAt: null };

        if (filters.authorId) {
            where.authorId = filters.authorId;
        }

        if (filters.categoryIds && filters.categoryIds.length > 0) {
            where.categories = {
                some: {
                    id: {
                        in: filters.categoryIds,
                    }
                }
            }
        }

        if (filters.tag && filters.tag.length > 0) {
            where.tags = {
                hasSome: filters.tag,
            }
        }

        try {
            if (orderBy !== 'category') {
                [data, count] = await this.prismaClient.$transaction([
                    this.repo.findMany({
                        skip,
                        take: limit,
                        where,
                        orderBy: orderBy === 'category' ? undefined : { [orderBy]: order },
                        include: {
                            categories: true
                        }
                    }),
                    this.repo.count({
                        where
                    })
                ]);

            } else if (orderBy === 'category') {
                [data, count] = await this.prismaClient.$transaction([
                    this.repo.findMany({
                        where,
                        include: {
                            categories: true
                        }
                    }),
                    this.repo.count({
                        where
                    })
                ]);
                data?.sort((a, b) => {
                    if (a.categories.length === 0 && b.categories.length === 0) {
                        return 0;
                    }
                    if (a.categories.length === 0) {
                        return 1;
                    }
                    if (b.categories.length === 0) {
                        return -1;
                    }

                    if (order === 'asc') {
                        return a.categories[0].id - b.categories[0].id;
                    } else {
                        return b.categories[0].id - a.categories[0].id;
                    }
                });

                data = data.slice(skip, skip + limit);
            }
            return [data, count];
        } catch (error) {
            console.log(error)
            return [[], 0];
        }
    }

    public static async getBlogById(id: number): Promise<Blog | null> {
        return await this.repo.findUnique({
            where: { id, deletedAt: null },
            include: {
                categories: true
            }
        });
    }

    public static async updateBlog(id: number, title?: string, content?: string, image?: string, tags?: string[], category?: ICategory): Promise<Blog | null | undefined> {
        try {
            const data: BlogUpdateData = {
                title, content, image, tags,
            };

            if (category) {
                await this.repo.update({
                    where: { id },
                    data: {
                        categories: {
                            set: []
                        }
                    }
                });

                data.categories = {
                    connect: [
                        {
                            id: category.id
                        }
                    ],
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