/*
  Warnings:

  - Added the required column `two_fa_activated` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Credentials" ADD COLUMN     "two_fa_activated" BOOLEAN NOT NULL,
ADD COLUMN     "two_fa_secret" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
