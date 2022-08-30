-- AlterTable
ALTER TABLE "User" ADD COLUMN     "two_fa_activated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_fa_secret" TEXT;
