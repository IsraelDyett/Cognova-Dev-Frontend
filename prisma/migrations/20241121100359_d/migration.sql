/*
  Warnings:

  - You are about to drop the column `typeId` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the `bot_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BotTypes" AS ENUM ('PRODUCTS_BUYER_ASSISTANT', 'KNOWLEDGE_BASE_ASSISTANT');

-- DropForeignKey
ALTER TABLE "bot_types" DROP CONSTRAINT "bot_types_planId_fkey";

-- DropForeignKey
ALTER TABLE "bots" DROP CONSTRAINT "bots_typeId_fkey";

-- DropIndex
DROP INDEX "workspace_invitations_email_key";

-- AlterTable
ALTER TABLE "bots" DROP COLUMN "typeId",
ADD COLUMN     "type" "BotTypes" NOT NULL DEFAULT 'KNOWLEDGE_BASE_ASSISTANT';

-- DropTable
DROP TABLE "bot_types";
