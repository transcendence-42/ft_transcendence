/*
  Warnings:

  - You are about to drop the column `playerScore` on the `PlayerOnMatch` table. All the data in the column will be lost.
  - You are about to drop the column `playerSide` on the `PlayerOnMatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerOnMatch" DROP COLUMN "playerScore",
DROP COLUMN "playerSide",
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "side" INTEGER NOT NULL DEFAULT 0;
