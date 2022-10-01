/*
  Warnings:

  - You are about to drop the column `hasLeftTheChannel` on the `UserOnChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserOnChannel" DROP COLUMN "hasLeftTheChannel",
ADD COLUMN     "hasLeftChannel" BOOLEAN NOT NULL DEFAULT false;
