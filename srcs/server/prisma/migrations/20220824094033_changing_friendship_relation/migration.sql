/*
  Warnings:

  - You are about to drop the `_userFriends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ladder" DROP CONSTRAINT "Ladder_userId_fkey";

-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_userId_fkey";

-- DropForeignKey
ALTER TABLE "_userFriends" DROP CONSTRAINT "_userFriends_A_fkey";

-- DropForeignKey
ALTER TABLE "_userFriends" DROP CONSTRAINT "_userFriends_B_fkey";

-- DropTable
DROP TABLE "_userFriends";

-- CreateTable
CREATE TABLE "UserFriendship" (
    "requesterId" INTEGER NOT NULL,
    "addresseeId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserFriendship_pkey" PRIMARY KEY ("requesterId","addresseeId")
);

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ladder" ADD CONSTRAINT "Ladder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFriendship" ADD CONSTRAINT "UserFriendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFriendship" ADD CONSTRAINT "UserFriendship_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
