import { Router } from "express";
import { validateRequest } from "../middleware/validation.middleware";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { BlogCategoriesController } from "../controller/blog-categories.controller";

const router: Router = Router();

router
    .post("/create",
        [
            body('name').notEmpty().isString().trim().escape().withMessage('Name field is required and should be a non-empty string.')
        ],
        validateRequest,
        authMiddleware,
        BlogCategoriesController.createBlogCategory
    )
    .get("/all-categories", BlogCategoriesController.getAllBlogCategory)
    .get("/:id", BlogCategoriesController.getBlogCategoryById)
    .put("/:id", [
        body('name').optional().isString().trim().escape().withMessage('Name field is required and should be a non-empty string.')  
    ],
        validateRequest,
        authMiddleware,
        BlogCategoriesController.updateBlogCategory
    )
    .delete("/:id", BlogCategoriesController.deleteBlogCategory)

export { router as blogCategoryRouter };
