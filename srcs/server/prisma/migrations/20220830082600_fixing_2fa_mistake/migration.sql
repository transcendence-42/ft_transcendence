/*
  Warnings:

  - You are about to drop the column `twoFactorActivated` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `Stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credentials" ADD COLUMN     "twoFactorActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT;

-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "twoFactorActivated",
DROP COLUMN "twoFactorSecret";
