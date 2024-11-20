/*
  Warnings:

  - The `status` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'UNACTIVE', 'SUSPENDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "ai_providers" ALTER COLUMN "apiKey" SET DEFAULT 'sk-no-key-required';

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "waPhoneNumber" TEXT,
ADD COLUMN     "waProfileName" TEXT,
ADD COLUMN     "waProfilePicture" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';
