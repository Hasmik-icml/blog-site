import { MenuSubMenu, PrismaClient } from "@prisma/client";

export class MenuSubMenuService {
    public static async create(name: string, type: string, status?: boolean): Promise<MenuSubMenu> {
        try {
            const client = new PrismaClient();
            const menuRepo = client.menuSubMenu;
            const menu: MenuSubMenu = await menuRepo.create({
                data: { name, type }
            });

            return menu;

        } catch (error) {
            console.log(555, error);
            throw new Error("Error creating menu/submenu: ");
        }
    }

    public static async FindAllMenusAndSubmenus(type: string): Promise<[data: MenuSubMenu[], count: number]> {
        try {
            const client = new PrismaClient();
            const menuRepo = client.menuSubMenu;
            const [data, count] = await client.$transaction([
                menuRepo.findMany({
                    where: { type, deletedAt: null, }
                }),
                menuRepo.count({
                    where: { type, deletedAt: null, }
                })
            ]);

            return [data, count];
        } catch (error) {
            console.log(555, error);
            throw new Error("Error creating menu/submenu: ");
        }
    }

    public static async updateMenuSubMenu(id: number, data: Partial<MenuSubMenu>) {
        try {
            const client = new PrismaClient();
            const menuRepo = client.menuSubMenu;

            const updatedMenuSubMenu = await menuRepo.update({
                where: { id },
                data,
            });

            return updatedMenuSubMenu;
        } catch (error) {
            console.error('Error updating menu/submenu:', error);
            throw new Error('Error updating menu/submenu');
        }
    }

    public static async deleteMenuSubMenu(id: number) {
        try {
            const client = new PrismaClient();
            const menuRepo = client.menuSubMenu;

            const existingMenuSubMenu = await menuRepo.findUnique({
                where: { id },
            });

            if (!existingMenuSubMenu) {
                return null;
            }
            console.log('existingMenuSubMenu', existingMenuSubMenu);
            const deleted = await menuRepo.update({
                where: { id },
                data: { deletedAt: new Date() },
            });

            return deleted;
        } catch (error) {
            console.error('Error deleting menu/submenu:', error);
            throw new Error('Error deleting menu/submenu');
        }
    }
}