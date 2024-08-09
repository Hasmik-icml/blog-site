import { Router } from "express";
import { body, param } from "express-validator";
import { MenuSubMenuController } from "../controller/menuSubMenu.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const
    router: Router = Router();
router
    .post("/create/:infotype",
        [
            param("infotype")
                .isString()
                .isIn(["menu", "subMenu"]).withMessage("Infotype nust be 'menu', 'subMenu'"),
            body('name')
                .trim()
                .escape()
                .isString().withMessage("The name of menu/submenu should be a string")
                .notEmpty().withMessage("Please provide a name for the menu/submenu"),
            body('url')
                .trim()
                .isString().withMessage("URL should be a string")
                .notEmpty()
                .isURL().withMessage("Please provide a valid URL"),
            body('order').optional().isInt().withMessage("Order should be an integer"),
            body('show').optional().isBoolean().withMessage("Show should be a boolean"),
            body('menuId')
                .if((value, { req }) => req.params?.infotype === "subMenu")
                .notEmpty()
                .withMessage("Menu ID is required for submenus")
                .isInt()
                .withMessage("Menu ID should be an integer"),
        ],
        validateRequest,
        authMiddleware,
        MenuSubMenuController.create,
    )
    .get("/:infotype",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Infotype nust be 'menu', 'subMenu'"),
        ],
        validateRequest,
        MenuSubMenuController.findAllMenusAndSubMenus
    )
    .patch("/:infotype/:id",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Infotype nust be 'menu', 'subMenu'"),
            body('name')
                .optional()
                .trim()
                .escape()
                .isString().withMessage("The name of menu/submenu should be a string"),
            body('url').optional().trim().isString().withMessage("URL should be a string").isURL().withMessage("Please provide a valid URL"),
            body('order').optional().isInt().withMessage("Order should be an integer"),
            body('show').optional().isBoolean().withMessage("Show should be a boolean"),
            body('menuId')
                .if((value, { req }) => req.params?.infotype === "subMenu")
                .optional()
                .isInt().withMessage("Menu ID should be an integer"),
        ],
        validateRequest,
        authMiddleware,
        MenuSubMenuController.updateMenuSubMenu
    )
    .delete("/:infotype/:id",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Invalid infotype"),
            param('id').isInt().withMessage('ID must be an integer'),
        ],
        validateRequest,
        authMiddleware,
        MenuSubMenuController.deleteMenuSubMenu
    )

export { router as menuRouter }