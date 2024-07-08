-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "categori" TEXT,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];
