/*
  Warnings:

  - You are about to drop the column `bannedUsersId` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "bannedUsersId";

-- AlterTable
ALTER TABLE "UserOnChannel" ADD COLUMN     "hasLeftTheChannel" BOOLEAN NOT NULL DEFAULT false;
