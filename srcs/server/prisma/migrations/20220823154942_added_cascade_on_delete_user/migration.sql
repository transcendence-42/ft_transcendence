-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
