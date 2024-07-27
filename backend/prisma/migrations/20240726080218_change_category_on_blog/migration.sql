/*
  Warnings:

  - The primary key for the `CategoriesOnBlogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CategoriesOnBlogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CategoriesOnBlogs" DROP CONSTRAINT "CategoriesOnBlogs_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CategoriesOnBlogs_pkey" PRIMARY KEY ("blogId", "categoryId");
