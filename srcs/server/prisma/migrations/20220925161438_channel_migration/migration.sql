/*
  Warnings:

  - You are about to drop the column `channelMode` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `UserOnChannel` table. All the data in the column will be lost.
  - Added the required column `type` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Channel_name_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "channelMode",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserOnChannel" DROP COLUMN "mode",
ADD COLUMN     "isTmpBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTmpMuted" BOOLEAN NOT NULL DEFAULT false;
