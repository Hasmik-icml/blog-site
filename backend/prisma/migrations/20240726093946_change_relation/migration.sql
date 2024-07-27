/*
  Warnings:

  - You are about to drop the `CategoriesOnBlogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnBlogs" DROP CONSTRAINT "CategoriesOnBlogs_blogId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnBlogs" DROP CONSTRAINT "CategoriesOnBlogs_categoryId_fkey";

-- DropTable
DROP TABLE "CategoriesOnBlogs";

-- CreateTable
CREATE TABLE "_BlogToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlogToCategory_AB_unique" ON "_BlogToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogToCategory_B_index" ON "_BlogToCategory"("B");

-- AddForeignKey
ALTER TABLE "_BlogToCategory" ADD CONSTRAINT "_BlogToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToCategory" ADD CONSTRAINT "_BlogToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
