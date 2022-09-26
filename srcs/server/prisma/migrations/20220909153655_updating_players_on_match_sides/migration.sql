/*
  Warnings:

  - You are about to drop the column `playerNum` on the `PlayerOnMatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerOnMatch" DROP COLUMN "playerNum",
ADD COLUMN     "playerSide" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" INTEGER;
