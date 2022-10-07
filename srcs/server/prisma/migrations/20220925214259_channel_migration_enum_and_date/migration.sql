/*
  Warnings:

  - You are about to drop the column `isTmpBanned` on the `UserOnChannel` table. All the data in the column will be lost.
  - You are about to drop the column `isTmpMuted` on the `UserOnChannel` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Channel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `role` to the `UserOnChannel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED', 'DIRECT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "type",
ADD COLUMN     "type" "ChannelType" NOT NULL;

-- AlterTable
ALTER TABLE "UserOnChannel" DROP COLUMN "isTmpBanned",
DROP COLUMN "isTmpMuted",
ADD COLUMN     "bannedTill" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mutedTill" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "UserRole" NOT NULL;
