import express, { Router } from 'express';
import { menuRouter } from './menu.routers';
import { authRouter } from './auth.routes';
import { blogRouter } from './blog.routes';
import { blogCategoryRouter } from './blog-categories.routes';

const router: Router = Router();

router.use('/menu-submenu', menuRouter);
router.use('/auth', authRouter);
router.use('/blog', blogRouter);
router.use('/blog-category', blogCategoryRouter);


export { router as router };
