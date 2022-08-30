/*
  Warnings:

  - You are about to drop the column `currentRank` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Rank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rank" DROP CONSTRAINT "Rank_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentRank";

-- DropTable
DROP TABLE "Rank";

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_key" ON "Rating"("userId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
