import { Router } from "express";
import { body, param } from "express-validator";
import { MenuSubMenuController } from "../controller/menuSubMenu.controller";

const
    router: Router = Router();
router
    .post("/create/:infotype",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Invalid infotype"),
            body('name').trim().escape().isString().notEmpty().withMessage("Please provide a name for the menu/submenu"),
            body('url').trim().escape().isString().notEmpty().withMessage("URL should be a string"),
            body('order').optional().isInt().withMessage("Order should be an integer"),
            body('show').optional().isBoolean().withMessage("Show should be a boolean"),
            body('menuId')
                .if((value, { req }) => req.params?.infotype === "subMenu")
                .notEmpty()
                .withMessage("Menu ID is required for submenus")
                .isInt()
                .withMessage("Menu ID should be an integer"),
        ],
        MenuSubMenuController.create,
    )
    .get("/:infotype",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Invalid infotype"),
        ],
        MenuSubMenuController.findAllMenusAndSubMenus
    )
    .patch("/:infotype/:id",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Invalid infotype"),
            body('name').optional().trim().escape().isString().withMessage("Please provide a name for the menu/submenu"),
            body('url').optional().trim().escape().isString().withMessage("URL should be a string"),
            body('order').optional().isInt().withMessage("Order should be an integer"),
            body('show').optional().isBoolean().withMessage("Show should be a boolean"),
            body('menuId')
                .if((value, { req }) => req.params?.infotype === "subMenu")
                .optional()
                .isInt()
                .withMessage("Menu ID should be an integer"),
        ],
        MenuSubMenuController.updateMenuSubMenu
    )
    .delete("/:infotype/:id",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Invalid infotype"),
            param('id').isInt().withMessage('ID must be an integer'),
        ],
        MenuSubMenuController.deleteMenuSubMenu
    )

export { router as menuRouter }