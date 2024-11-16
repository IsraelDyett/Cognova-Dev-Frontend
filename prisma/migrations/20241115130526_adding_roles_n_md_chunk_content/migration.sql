/*
  Warnings:

  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `workspace_users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropIndex
DROP INDEX "workspaces_id_planId_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roleId";

-- AlterTable
ALTER TABLE "vectors" ADD COLUMN     "markdownChunkContent" TEXT;

-- AlterTable
ALTER TABLE "workspace_users" DROP COLUMN "status",
ADD COLUMN     "roleId" TEXT;

-- CreateTable
CREATE TABLE "WorkspaceInvitation" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "WorkspaceInviteStatus" NOT NULL DEFAULT 'PENDING',
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvitation_email_key" ON "WorkspaceInvitation"("email");

-- CreateIndex
CREATE INDEX "models_name_idx" ON "models"("name");

-- CreateIndex
CREATE INDEX "workspace_users_id_userId_idx" ON "workspace_users"("id", "userId");

-- CreateIndex
CREATE INDEX "workspaces_id_planId_name_idx" ON "workspaces"("id", "planId", "name");

-- AddForeignKey
ALTER TABLE "workspace_users" ADD CONSTRAINT "workspace_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
