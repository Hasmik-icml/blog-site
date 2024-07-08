import { Response, Request } from "express";
import { MenuSubMenuService } from "../services/menuSubMenu.service";
import { MenuSubMenu } from "@prisma/client";

export class MenuSubMenuController {
    public static async create(req: Request, res: Response): Promise<void> {
        const type = req.params.infotype;
        const { name, status } = req.body;
        console.log("1111", type, name,)
        try {
            const result: MenuSubMenu = await MenuSubMenuService.create(name, type);
            res.status(200).send(result);
        } catch (errror) {
            console.log(errror);
            res.status(500).send();
        }
    }

    public static async findAllMenusAndSubMenus(req: Request, res: Response): Promise<void> {
        try {
            const type = req.params.infotype;
            const [data, count] = await MenuSubMenuService.FindAllMenusAndSubmenus(type);
            console.log(222, data, count);
           
            res.status(200).send({ data, count });
        } catch (errror) {
            console.log(errror);
            res.status(500).send();
        }   
    }

    public static async updateMenuSubMenu(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const data = req.body;

        try {
            const updatedMenuSubMenu = await MenuSubMenuService.updateMenuSubMenu(id, data);
            res.status(200).send(updatedMenuSubMenu);
        } catch (error) {
            console.error('Error updating menu/submenu:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public static async deleteMenuSubMenu(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);

        try {
            const deletedMenuSubMenu = await MenuSubMenuService.deleteMenuSubMenu(id);

            if (!deletedMenuSubMenu) {
                res.status(404).send('Menu/Submenu not found');
            }

            res.status(200).send(deletedMenuSubMenu);
        } catch (error) {
            console.error('Error updating menu/submenu:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}
