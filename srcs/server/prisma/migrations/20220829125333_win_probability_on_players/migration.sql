/*
  Warnings:

  - Added the required column `winProbability` to the `PlayerOnMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlayerOnMatch" ADD COLUMN     "winProbability" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "eloRating" INTEGER NOT NULL DEFAULT 1000;
