/*
  Warnings:

  - You are about to drop the `_BlogToCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogToCategory" DROP CONSTRAINT "_BlogToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToCategory" DROP CONSTRAINT "_BlogToCategory_B_fkey";

-- DropTable
DROP TABLE "_BlogToCategory";

-- CreateTable
CREATE TABLE "CategoriesOnBlogs" (
    "blogId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "CategoriesOnBlogs_pkey" PRIMARY KEY ("blogId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnBlogs" ADD CONSTRAINT "CategoriesOnBlogs_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnBlogs" ADD CONSTRAINT "CategoriesOnBlogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
