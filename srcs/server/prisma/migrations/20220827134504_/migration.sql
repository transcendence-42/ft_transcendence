/*
  Warnings:

  - You are about to drop the column `two_fa_activated` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `two_fa_secret` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `two_fa_activated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `two_fa_secret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credentials" DROP COLUMN "two_fa_activated",
DROP COLUMN "two_fa_secret",
ADD COLUMN     "twoFactorActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "two_fa_activated",
DROP COLUMN "two_fa_secret";
