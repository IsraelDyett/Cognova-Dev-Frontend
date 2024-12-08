/*
  Warnings:

  - You are about to drop the column `waPhoneNumber` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `waPhoneNumber` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `waProfileName` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `waProfilePicture` on the `conversations` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "bots_waPhoneNumber_key";

-- AlterTable
ALTER TABLE "bots" DROP COLUMN "waPhoneNumber";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "waPhoneNumber",
DROP COLUMN "waProfileName",
DROP COLUMN "waProfilePicture";
