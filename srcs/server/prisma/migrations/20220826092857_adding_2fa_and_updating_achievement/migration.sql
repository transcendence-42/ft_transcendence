/*
  Warnings:

  - The primary key for the `UserAchievement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `statsId` on the `UserAchievement` table. All the data in the column will be lost.
  - You are about to drop the `Ladder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `UserAchievement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ladder" DROP CONSTRAINT "Ladder_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_statsId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasActivated2fa" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_pkey",
DROP COLUMN "statsId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("achievementId", "userId");

-- DropTable
DROP TABLE "Ladder";

-- CreateTable
CREATE TABLE "Rank" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rank_userId_key" ON "Rank"("userId");

-- AddForeignKey
ALTER TABLE "Rank" ADD CONSTRAINT "Rank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
