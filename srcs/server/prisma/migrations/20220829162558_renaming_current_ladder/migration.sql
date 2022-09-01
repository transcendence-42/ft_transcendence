/*
  Warnings:

  - You are about to drop the column `currentLadder` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentLadder",
ADD COLUMN     "currentRank" INTEGER NOT NULL DEFAULT 0;
