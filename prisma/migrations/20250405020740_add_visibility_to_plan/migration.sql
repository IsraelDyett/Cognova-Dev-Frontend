/*
  Warnings:

  - You are about to drop the `business_product_categories` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `businessId` on table `bots` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bots" DROP CONSTRAINT "bots_businessId_fkey";

-- DropForeignKey
ALTER TABLE "business_product_categories" DROP CONSTRAINT "business_product_categories_businessId_fkey";

-- DropForeignKey
ALTER TABLE "business_products" DROP CONSTRAINT "business_products_categoryId_fkey";

-- AlterTable
ALTER TABLE "bots" ALTER COLUMN "businessId" SET NOT NULL;

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "business_product_categories";

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_products" ADD CONSTRAINT "business_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
