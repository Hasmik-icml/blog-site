import { Menu, PrismaClient, SubMenu } from "@prisma/client";

export class MenuSubMenuService {
    public static async create(name: string, url: string, order: number, show: boolean, menuId: number, type: string): Promise<Menu | SubMenu> {
        if (type !== 'menu' && type !== 'subMenu') {
            throw new Error('Invalid type provided');
        }
        const client = new PrismaClient();

        try {
            const menuRepo = client.menu;
            const subMneuRepo = client.subMenu;
            let result: Menu | SubMenu | null = null;

            if (type === "menu") {
                result = await menuRepo.create({
                    data: {
                        name, url, order, show
                    },
                });
            } else if (type === "subMenu") {
                result = await subMneuRepo.create({
                    data: {
                        name, url, order, show, menuId
                    }
                });
            }

            if (!result) {
                throw new Error('Creation failed');
            }

            return result;

        } catch (error) {
            console.log(555, error);
            throw new Error("Error creating menu/submenu: ");
        }
    }

    public static async FindAllMenusAndSubmenus(type: string): Promise<[data: Menu[] | SubMenu[], count: number]> {
        if (type !== 'menu' && type !== 'subMenu') {
            throw new Error('Invalid type provided');
        }
        const client = new PrismaClient();

        try {
            const menuRepo = client.menu;
            const subMneuRepo = client.subMenu;
            let result: [data: Menu[] | SubMenu[], count: number] | null = null;

            if (type === "menu") {
                const [data, count] = await client.$transaction([
                    menuRepo.findMany({
                        where: { deletedAt: null, },
                        include: { subMenus: true }
                    }),
                    menuRepo.count({
                        where: { deletedAt: null, }
                    })
                ]);
                result = [data, count];
            } else if (type === "subMenu") {
                const [data, count] = await client.$transaction([
                    subMneuRepo.findMany({
                        where: { deletedAt: null, },
                        include: { menu: true }
                    }),
                    subMneuRepo.count({
                        where: { deletedAt: null, }
                    })
                ]);
                result = [data, count];
            }

            if (!result) {
                throw new Error('Creation failed');
            }

            return result;
        } catch (error) {
            console.log(555, error);
            throw new Error("Error creating menu/submenu: ");
        }
    }

    public static async updateMenuSubMenu(id: number, type: string, data: Partial<Menu | SubMenu>) {
        const client = new PrismaClient();
        try {
            const menuRepo = client.menu;
            const subMenuRepo = client.subMenu;

            if (type !== 'menu' && type !== 'subMenu') {
                throw new Error('Invalid type provided');
            }

            let result: Menu | SubMenu | null = null;

            if (type === 'menu') {
                result = await menuRepo.update({
                    where: { id },
                    data,
                });
            } else if (type === 'subMenu') {
                result = await subMenuRepo.update({
                    where: { id },
                    data,
                });
            }

            if (!result) {
                throw new Error('Creation failed');
            }

            return result;
        } catch (error) {
            console.error('Error updating menu/submenu:', error);
            throw new Error('Error updating menu/submenu');
        }
    }

    public static async deleteMenuSubMenu(id: number, type: string) {
        if (type !== 'menu' && type !== 'subMenu') {
            throw new Error('Invalid type provided');
        }
        try {
            const client = new PrismaClient();
            const menuRepo = client.menu;
            const subMenuRepo = client.subMenu;

            let result;
            let deleted;

            if (type === 'menu') {
                result = await menuRepo.findUnique({
                    where: { id },
                });
                if (result) {
                    deleted = await menuRepo.update({
                        where: { id },
                        data: { deletedAt: new Date() },
                    });
                }
            } else if (type === 'subMenu') {
                result = await subMenuRepo.findUnique({
                    where: { id },
                });
                if (result) {
                    deleted = await subMenuRepo.update({
                        where: { id },
                        data: { deletedAt: new Date() },
                    });
                }
            }

            if (!result) {
                return null;
            }

            return deleted;
        } catch (error) {
            console.error('Error deleting menu/submenu:', error);
            throw new Error('Error deleting menu/submenu');
        }
    }
}