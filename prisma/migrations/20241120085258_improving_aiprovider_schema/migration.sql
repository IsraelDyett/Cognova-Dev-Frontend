/*
  Warnings:

  - Added the required column `apiKey` to the `AiProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endpointUrl` to the `AiProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AiProvider" ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "endpointUrl" TEXT NOT NULL;
