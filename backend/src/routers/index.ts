import express, { Router } from 'express';
import { menuRouter } from './menu.routers';

const router: Router = Router();

router.use('/menu-submenu', menuRouter);

export { router as menuRouter };
