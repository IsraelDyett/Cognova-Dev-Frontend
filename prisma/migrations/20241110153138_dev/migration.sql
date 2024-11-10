/*
  Warnings:

  - You are about to drop the column `aAvatarURL` on the `bot_configuration` table. All the data in the column will be lost.
  - You are about to drop the column `uAvatarURL` on the `bot_configuration` table. All the data in the column will be lost.
  - You are about to drop the column `llmModelId` on the `bots` table. All the data in the column will be lost.
  - The `feedback` column on the `chats` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `slugName` on the `payment_methods` table. All the data in the column will be lost.
  - You are about to drop the column `slugName` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `sources` table. All the data in the column will be lost.
  - You are about to drop the column `slugName` on the `techniques` table. All the data in the column will be lost.
  - You are about to drop the `llm_models` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `payment_methods` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `techniques` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.
  - The required column `sessionId` was added to the `conversations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `displayName` to the `payment_methods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `techniques` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatFeedback" AS ENUM ('DOWNVOTED', 'UPVOTED', 'NONE');

-- AlterEnum
ALTER TYPE "BillingCycle" ADD VALUE 'UNLIMITED';

-- DropForeignKey
ALTER TABLE "bots" DROP CONSTRAINT "bots_llmModelId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "llm_models" DROP CONSTRAINT "llm_models_planId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_planId_fkey";

-- DropIndex
DROP INDEX "payment_methods_slugName_key";

-- DropIndex
DROP INDEX "plans_slugName_key";

-- DropIndex
DROP INDEX "techniques_slugName_key";

-- AlterTable
ALTER TABLE "bot_configuration" DROP COLUMN "aAvatarURL",
DROP COLUMN "uAvatarURL",
ADD COLUMN     "botChatAvatarURL" TEXT;

-- AlterTable
ALTER TABLE "bots" DROP COLUMN "llmModelId",
ADD COLUMN     "businessId" TEXT,
ADD COLUMN     "modelId" TEXT;

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "feedback",
ADD COLUMN     "feedback" "ChatFeedback" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_methods" DROP COLUMN "slugName",
ADD COLUMN     "displayName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "subscriptionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "slugName",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "displayName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sources" DROP COLUMN "summary";

-- AlterTable
ALTER TABLE "techniques" DROP COLUMN "slugName",
ADD COLUMN     "displayName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "displayName" TEXT NOT NULL,
ALTER COLUMN "planId" DROP NOT NULL;

-- DropTable
DROP TABLE "llm_models";

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hasDelivery" BOOLEAN NOT NULL DEFAULT false,
    "hasPickup" BOOLEAN NOT NULL DEFAULT false,
    "acceptsReturns" BOOLEAN NOT NULL DEFAULT false,
    "hasWarranty" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_configs" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "deliveryFee" DOUBLE PRECISION,
    "minOrderAmount" DOUBLE PRECISION,
    "taxRate" DOUBLE PRECISION,
    "returnPeriodDays" INTEGER,
    "warrantyPeriodDays" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',

    CONSTRAINT "business_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_hours" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "locationId" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "operating_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "planId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_configs_businessId_key" ON "business_configs"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "models_name_key" ON "models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_name_key" ON "payment_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "techniques_name_key" ON "techniques"("name");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_name_key" ON "workspaces"("name");

-- CreateIndex
CREATE INDEX "workspaces_id_planId_idx" ON "workspaces"("id", "planId");

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_configs" ADD CONSTRAINT "business_configs_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_hours" ADD CONSTRAINT "operating_hours_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_hours" ADD CONSTRAINT "operating_hours_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
