-- AlterTable
ALTER TABLE "users" ADD COLUMN "telegramId" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "users_telegramId_key" ON "users"("telegramId");
