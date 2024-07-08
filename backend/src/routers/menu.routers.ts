import { Router } from "express";
import { body, param } from "express-validator";
import { MenuSubMenuController } from "../controller/menuSubMenu.controller";

const router: Router = Router();
router
    .post("/create/:infotype",
        [
            body('name').trim().escape().isString().isEmpty().withMessage("Please provide a name for the menu/submenu"),
            body('status').optional(),
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Invalid infotype"),
        ],
        MenuSubMenuController.create,
    )
    .get("/:infotype",
        [
            param("infotype").isString().isIn(["menu", "subMenu"]).withMessage("Invalid infotype"),
        ],
        MenuSubMenuController.findAllMenusAndSubMenus
    )
    .patch("/:id",
        [
            param('id').isInt().withMessage('ID must be an integer'),
            body('name').optional().isString().withMessage('Name must be a string'),
            body('type').optional().isString().withMessage('Type must be a string'),
        ],
        MenuSubMenuController.updateMenuSubMenu
    )
    .delete("/:id",
        [
            param('id').isInt().withMessage('ID must be an integer'),
        ],
        MenuSubMenuController.deleteMenuSubMenu
    )

export { router as menuRouter }