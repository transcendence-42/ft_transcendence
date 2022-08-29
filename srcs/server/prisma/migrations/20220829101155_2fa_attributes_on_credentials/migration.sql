/*
  Warnings:

  - You are about to drop the column `hasActivated2fa` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "twoFactorActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasActivated2fa";
