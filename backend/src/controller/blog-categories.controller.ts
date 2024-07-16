import { Request, Response } from "express";
import { BlogCategoryService } from './../services/blog-categories.server';

export class BlogCategoriesController {
    public static async createBlogCategory(req: Request, res: Response) {
        const categoryName = req.body.name;
        try {
            const blogCategory = await BlogCategoryService.create(categoryName);
            res.status(200).send(blogCategory);
        } catch (error) {
            console.log(error);
        }
    }
    public static async getAllBlogCategory(req: Request, res: Response): Promise<void> {
        try {
            const allCategories = await BlogCategoryService.getAll();
            res.status(200).send(allCategories);
        } catch (error) {
            console.log(error);
        }
    }
    public static async getBlogCategoryById(req: Request, res: Response): Promise<void> {
        const categoryId = Number(req.params.id);
        try {
            const categoryById = await BlogCategoryService.getById(categoryId);
            res.status(200).send(categoryById);
        } catch (error) {
            console.log(error);
        }

    }
    public static async updateBlogCategory(req: Request, res: Response): Promise<void> {
        const categoryId = Number(req.params.id);
        const categoryName = req.body.name;
        try {
            const updatedCategory = await BlogCategoryService.update(categoryId, categoryName);
            res.status(200).send(updatedCategory);
        } catch (error) {
            console.log(error);
        }
    }
    public static async deleteBlogCategory(req: Request, res: Response) {
        const categoryId = Number(req.params.id);
        try {
            const deletedCategory = await BlogCategoryService.delete(categoryId);
            res.status(200).send(deletedCategory);
        } catch (error) {
            console.log(error);
        }
    }
}