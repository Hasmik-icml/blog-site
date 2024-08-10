import { Request, Response } from "express";
import { BlogCategoryService } from './../services/blog-categories.server';
import { CustomError } from "../errors/custom.error";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "../handlers/not-found.handler";

export class BlogCategoriesController {
    public static async createBlogCategory(req: Request, res: Response) {
        const categoryName = req.body.name;
        try {
            const blogCategory = await BlogCategoryService.create(categoryName);
            res.status(200).send(blogCategory);
        } catch (error) {
            console.log(error);
            throw new Error("Someting went wrong");
        }
    }
    public static async getAllBlogCategory(req: Request, res: Response): Promise<void> {
        try {
            const allCategories = await BlogCategoryService.getAll();
            res.status(200).send(allCategories);
        } catch (error) {
            console.log(error);
            throw new Error("Someting went wrong");
        }
    }
    public static async getBlogCategoryById(req: Request, res: Response): Promise<void> {
        const categoryId = Number(req.params.id);
        try {
            const categoryById = await BlogCategoryService.getById(categoryId);
            res.status(200).send(categoryById);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                const notFoundError = new NotFoundError('Category not found');
                res.status(notFoundError.statusCode).send({ errors: notFoundError.serializeErrors() });
            }
            res.status(500).send({ message: 'Internal Server Error' });
        }

    }
    public static async updateBlogCategory(req: Request, res: Response): Promise<void> {
        const categoryId = Number(req.params.id);
        const categoryName = req.body.name;
        try {
            const updatedCategory = await BlogCategoryService.update(categoryId, categoryName);
            res.status(200).send(updatedCategory);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(error.statusCode).send({ errors: error.serializeErrors() });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        }
    }
    public static async deleteBlogCategory(req: Request, res: Response) {
        const categoryId = Number(req.params.id);
        try {
            const deletedCategory = await BlogCategoryService.delete(categoryId);
            res.status(200).send(deletedCategory);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ errors: error.serializeErrors() });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        }
    }
}