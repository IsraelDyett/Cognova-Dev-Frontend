/*
  Warnings:

  - Added the required column `provider` to the `ai_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ai_providers" ADD COLUMN     "provider" TEXT NOT NULL;
