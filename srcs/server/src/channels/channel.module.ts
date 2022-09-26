import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";

@Module({
    imports: [PrismaModule],
    providers: [ChannelService, PrismaService],
    controllers: [ChannelController]
})
export class ChannelModule {}