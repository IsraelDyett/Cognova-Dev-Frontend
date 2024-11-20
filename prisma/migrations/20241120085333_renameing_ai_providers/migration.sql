/*
  Warnings:

  - You are about to drop the `AiProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "models" DROP CONSTRAINT "models_aiProviderId_fkey";

-- DropTable
DROP TABLE "AiProvider";

-- CreateTable
CREATE TABLE "ai_providers" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "endpointUrl" TEXT NOT NULL,
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_providers_name_key" ON "ai_providers"("name");

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_aiProviderId_fkey" FOREIGN KEY ("aiProviderId") REFERENCES "ai_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
