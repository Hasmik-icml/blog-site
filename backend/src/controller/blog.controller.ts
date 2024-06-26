import { Request, Response } from "express";
import { BlogService } from "../services/blog.service";

export class BlogController {
    public static async createBlog(req: Request, res: Response): Promise<void> {
        const { title, content, image, tags } = req.body;
        const userId = (req as any).userId;

        try {
            const newBlog = await BlogService.createBlog(title, content, userId, image, tags);
            res.status(200).send(newBlog);
        } catch (error) {
            res.status(500).json({ error: 'Error creating blog' });
        }
    }

    public static async getAllBlogs(req: Request, res: Response): Promise<void> {
        try {
            const allBlogs = await BlogService.getAllBlogs();
            res.status(200).send(allBlogs);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching blogs' });

        }
    }

    public static async getBlogById(req: Request, res: Response): Promise<void> {
        const blogId = Number(req.params.id);
        try {
            const blog = await BlogService.getBlogById(blogId);
            res.status(200).send(blog);
        } catch (error) {

        }
    }

    public static async updateBlog(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { title, content, image, tags } = req.body;
        // const userId = (req as any).userId;
        try {
            console.log(222, { title, content, image, tags } )
            const newBlog = await BlogService.updateBlog(parseInt(id), title, content, image, tags);
            res.status(200).send(newBlog);
        } catch (error) {
            res.status(500).json({ error: 'Error updating blog' });
        }
    }

    public static async deleteBlog(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const deletedBlog = await BlogService.deleteBlog(parseInt(id));
            res.status(200).send(deletedBlog);
        } catch (error) {
            res.status(500).json({ error: 'Error deleting blog' });
        }
    }
}