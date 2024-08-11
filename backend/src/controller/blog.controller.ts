import { Request, Response } from "express";
import { BlogService } from "../services/blog.service";
import getOrderParams from './../helpers/order-params.helper';
import getFilterParams from "../helpers/filters-params.helper";
import { CustomError } from "../errors/custom.error";

export class BlogController {
    public static async createBlog(req: Request, res: Response): Promise<void> {
        const { title, content, image, tags, category } = req.body;
        const userId = (req as any).userId;

        try {
            const newBlog = await BlogService.createBlog(title, content, userId, image, tags, category);
            res.status(200).send(newBlog);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ errors: error.serializeErrors() });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        }
    }

    public static async getAllBlogs(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;

            const { orderField, order } = getOrderParams(req);
            const filters = getFilterParams(req);

            const [data, count] = await BlogService.getAllBlogs(page, limit, orderField, order, filters);
            res.status(200).send({ data, count });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching blogs' });

        }
    }

    public static async getBlogById(req: Request, res: Response): Promise<void> {
        const blogId = Number(req.params.id);
        try {
            const blog = await BlogService.getBlogById(blogId);
            res.status(200).send(blog || {});
        } catch (error) {

        }
    }

    public static async updateBlog(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { title, content, image, tags, category } = req.body;
        try {
            const newBlog = await BlogService.updateBlog(parseInt(id), title, content, image, tags, category);
            res.status(200).send(newBlog);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ errors: error.serializeErrors() });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        }
    }

    public static async deleteBlog(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const deletedBlog = await BlogService.deleteBlog(parseInt(id));
            res.status(200).send(deletedBlog);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ errors: error.serializeErrors() });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        }
    }
}