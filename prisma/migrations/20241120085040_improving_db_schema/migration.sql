/*
  Warnings:

  - You are about to drop the column `name` on the `plan_features` table. All the data in the column will be lost.
  - You are about to drop the column `billingCycle` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `workspaces` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[waPhoneNumber]` on the table `bots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `plan_features` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_planId_fkey";

-- DropIndex
DROP INDEX "workspaces_id_planId_name_idx";

-- AlterTable
ALTER TABLE "bots" ADD COLUMN     "typeId" TEXT,
ADD COLUMN     "waPhoneNumber" TEXT;

-- AlterTable
ALTER TABLE "models" ADD COLUMN     "aiProviderId" TEXT;

-- AlterTable
ALTER TABLE "plan_features" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "billingCycle",
ADD COLUMN     "annuallyPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "monthlyPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY';

-- AlterTable
ALTER TABLE "workspaces" DROP COLUMN "planId";

-- CreateTable
CREATE TABLE "bot_types" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiProvider" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bot_types_name_key" ON "bot_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AiProvider_name_key" ON "AiProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bots_waPhoneNumber_key" ON "bots"("waPhoneNumber");

-- CreateIndex
CREATE INDEX "subscriptions_workspaceId_idx" ON "subscriptions"("workspaceId");

-- CreateIndex
CREATE INDEX "workspaces_id_name_idx" ON "workspaces"("id", "name");

-- AddForeignKey
ALTER TABLE "bots" ADD CONSTRAINT "bots_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "bot_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_aiProviderId_fkey" FOREIGN KEY ("aiProviderId") REFERENCES "AiProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_types" ADD CONSTRAINT "bot_types_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
