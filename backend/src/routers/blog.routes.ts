import { Router } from "express";
import { body } from 'express-validator';
import { BlogController } from "../controller/blog.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "./error.handler";

const router: Router = Router();

router
    .post("/create",
        [
            body('title').notEmpty().isString().trim().escape().withMessage("Title required and must be a string"),
            body('content').notEmpty().isString().trim().escape().withMessage("Content required and must be a string"),
            body('image').optional().isString(),
            body('tags').isArray({ min: 1 }).withMessage('Tags must be an array with at least one element')
                .custom((tags) => {
                    return tags.every((tag: any) => typeof tag === 'string');
                }).withMessage('Each tag must be a string')
        ],
        validateRequest,
        authMiddleware,
        BlogController.createBlog)
    .get("/all-blogs", BlogController.getAllBlogs)
    .get("/:id", BlogController.getBlogById)
    .put("/:id",
        [
            body('title').optional().isString().trim().escape(),
            body('content').optional().isString().trim().escape(),
            body('image').optional().isString().trim().escape(),
            body('tags').optional().isArray({ min: 1 }).withMessage('Tags must be an array with at least one element')
                .custom((tags) => {
                    return tags.every((tag: any) => typeof tag === 'string');
                }).withMessage('Each tag must be a string')
        ],
        validateRequest,
        authMiddleware,
        BlogController.updateBlog)
    .delete("/:id", BlogController.deleteBlog)

export { router as blogRouter };