/*
  Warnings:

  - You are about to drop the column `hasActivated2fa` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasActivated2fa";
