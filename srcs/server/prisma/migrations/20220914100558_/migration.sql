/*
  Warnings:

  - You are about to drop the column `status` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `playerNum` on the `PlayerOnMatch` table. All the data in the column will be lost.
  - You are about to drop the column `playerScore` on the `PlayerOnMatch` table. All the data in the column will be lost.
  - You are about to drop the column `winProbability` on the `PlayerOnMatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "PlayerOnMatch" DROP COLUMN "playerNum",
DROP COLUMN "playerScore",
DROP COLUMN "winProbability",
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "side" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" INTEGER;
