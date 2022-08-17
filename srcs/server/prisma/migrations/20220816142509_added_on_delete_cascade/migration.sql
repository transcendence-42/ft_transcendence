-- DropForeignKey
ALTER TABLE "Credentials" DROP CONSTRAINT "Credentials_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
