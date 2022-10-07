/*
  Warnings:

  - You are about to drop the column `bannedTill` on the `UserOnChannel` table. All the data in the column will be lost.
  - You are about to drop the column `mutedTill` on the `UserOnChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserOnChannel" DROP COLUMN "bannedTill",
DROP COLUMN "mutedTill",
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMuted" BOOLEAN NOT NULL DEFAULT false;
