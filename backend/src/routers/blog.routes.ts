import { Router } from "express";
import { body, query } from 'express-validator';
import { BlogController } from "../controller/blog.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";

const router: Router = Router();

router
    .post("/create",
        [
            body('title').notEmpty().isString().trim().escape().withMessage("The title is required and must be a string"),
            body('content').notEmpty().isString().trim().escape().withMessage("The content is required and must be a string"),
            body('image').optional().isString(),
            body('tags').optional().isArray({ min: 1 }).withMessage('Tags must be an array with at least one element')
                .custom((tags) => {
                    return tags.every((tag: any) => typeof tag === 'string');
                }).withMessage('Each tag must be a string'),
            body('category')
                .notEmpty().withMessage("Category is required")
                .isObject().withMessage('The category must be an object'),
            body('category.id')
                .notEmpty().withMessage("The category ID is required")
                .isInt().withMessage('The category id must be a number'),
            body('category.name')
                .notEmpty().withMessage("The category name is required")
                .isString().withMessage('The category name must be a string')
        ],
        validateRequest,
        authMiddleware,
        BlogController.createBlog)
    .get("/all-blogs",
        [
            query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
            query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
            query('orderBy').optional().isIn(['id', 'createdAt', 'updatedAt', 'category']).withMessage('Order must be "id", "createdAt", "updatedAt", "category"'),
            query('authorId').optional().isString().withMessage('AuthorId must be a string'),
            query('categoryIds').optional().isArray().withMessage('CategoryIds must be an array'),
            query('tag').optional().isString().withMessage('Tag must be a string')
        ],
        validateRequest,
        BlogController.getAllBlogs)
    .get("/:id", BlogController.getBlogById)
    .put("/:id",
        [
            body('title')
                .optional()
                .isString().withMessage("The title must be a string")
                .trim()
                .escape(),
            body('content')
                .optional()
                .isString().withMessage("The content must be a string")
                .trim()
                .escape(),
            body('image').optional().isString().trim().escape(),
            body('tags').optional().isArray({ min: 1 }).withMessage('Tags must be an array with at least one element')
                .custom((tags) => {
                    return tags.every((tag: any) => typeof tag === 'string');
                }).withMessage('Each tag must be a string'),
            body('category')
                .optional()
                .isObject().withMessage('The category must be an object'),
            body('category.id').if(body('category').exists())
                .notEmpty().withMessage("Please provide the category ID")
                .isInt().withMessage('The category ID must be a number'),
            body('category.name').if(body('category').exists())
                .notEmpty()
                .isString().withMessage('The category name must be a string')
        ],
        validateRequest,
        authMiddleware,
        BlogController.updateBlog)
    .delete("/:id", authMiddleware, BlogController.deleteBlog)

export { router as blogRouter };