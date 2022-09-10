/*
  Warnings:

  - You are about to drop the column `status` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `winProbability` on the `PlayerOnMatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "PlayerOnMatch" DROP COLUMN "winProbability";
