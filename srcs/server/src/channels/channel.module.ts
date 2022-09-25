import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: []
})
export class ChannelModule {}