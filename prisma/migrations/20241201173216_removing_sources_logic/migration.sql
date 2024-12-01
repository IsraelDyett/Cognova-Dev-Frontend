/*
  Warnings:

  - The values [PRODUCTS_BUYER_ASSISTANT,KNOWLEDGE_BASE_ASSISTANT] on the enum `BotTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `placeholderMessage` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `starterQuestions` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeMessage` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `minOrderAmount` on the `business_configs` table. All the data in the column will be lost.
  - You are about to drop the column `returnPeriodDays` on the `business_configs` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `business_configs` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyPeriodDays` on the `business_configs` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `business_locations` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `business_locations` table. All the data in the column will be lost.
  - The `dayOfWeek` column on the `business_operating_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `sku` on the `business_products` table. All the data in the column will be lost.
  - You are about to drop the column `acceptsReturns` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `hasDelivery` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `hasPickup` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `hasWarranty` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `sourceURLs` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `vectors` table. All the data in the column will be lost.
  - You are about to drop the `bot_configuration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bot_sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `syncs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `techniques` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
BEGIN;
CREATE TYPE "BotTypes_new" AS ENUM ('SALES_ASSISTANT', 'CUSTOMER_SUPPORT_ASSISTANT');
ALTER TABLE "bots" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "bots" ALTER COLUMN "type" TYPE "BotTypes_new" USING ("type"::text::"BotTypes_new");
ALTER TYPE "BotTypes" RENAME TO "BotTypes_old";
ALTER TYPE "BotTypes_new" RENAME TO "BotTypes";
DROP TYPE "BotTypes_old";
ALTER TABLE "bots" ALTER COLUMN "type" SET DEFAULT 'SALES_ASSISTANT';
COMMIT;

-- DropForeignKey
ALTER TABLE "bot_configuration" DROP CONSTRAINT "bot_configuration_botId_fkey";

-- DropForeignKey
ALTER TABLE "bot_sources" DROP CONSTRAINT "bot_sources_botId_fkey";

-- DropForeignKey
ALTER TABLE "bot_sources" DROP CONSTRAINT "bot_sources_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "sources" DROP CONSTRAINT "sources_techniqueId_fkey";

-- DropForeignKey
ALTER TABLE "sources" DROP CONSTRAINT "sources_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "syncs" DROP CONSTRAINT "syncs_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "techniques" DROP CONSTRAINT "techniques_planId_fkey";

-- DropForeignKey
ALTER TABLE "vectors" DROP CONSTRAINT "vectors_sourceId_fkey";

-- AlterTable
ALTER TABLE "bots" DROP COLUMN "placeholderMessage",
DROP COLUMN "starterQuestions",
DROP COLUMN "welcomeMessage",
ALTER COLUMN "type" SET DEFAULT 'SALES_ASSISTANT';

-- AlterTable
ALTER TABLE "business_configs" DROP COLUMN "minOrderAmount",
DROP COLUMN "returnPeriodDays",
DROP COLUMN "taxRate",
DROP COLUMN "warrantyPeriodDays",
ADD COLUMN     "acceptsReturns" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasDelivery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasWarranty" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minDeliveryOrderAmount" DOUBLE PRECISION,
ADD COLUMN     "returnPeriod" TEXT,
ADD COLUMN     "warrantyPeriod" TEXT;

-- AlterTable
ALTER TABLE "business_locations" DROP COLUMN "postalCode",
DROP COLUMN "state";

-- AlterTable
ALTER TABLE "business_operating_hours" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "WeekDays";

-- AlterTable
ALTER TABLE "business_products" DROP COLUMN "sku";

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "acceptsReturns",
DROP COLUMN "hasDelivery",
DROP COLUMN "hasPickup",
DROP COLUMN "hasWarranty";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "sourceURLs",
ADD COLUMN     "extraMetadata" JSONB,
ADD COLUMN     "reaction" TEXT;

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "browser",
DROP COLUMN "device",
DROP COLUMN "os";

-- AlterTable
ALTER TABLE "vectors" DROP COLUMN "sourceId";

-- DropTable
DROP TABLE "bot_configuration";

-- DropTable
DROP TABLE "bot_sources";

-- DropTable
DROP TABLE "sources";

-- DropTable
DROP TABLE "syncs";

-- DropTable
DROP TABLE "techniques";
