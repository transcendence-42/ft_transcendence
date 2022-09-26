import { Module } from "@nestjs/common";
import { FriendshipService } from "src/friendship/friendship.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";

@Module({
    imports: [PrismaModule, UserModule],
    providers: [ChannelService, PrismaService, UserService, FriendshipService],
    controllers: [ChannelController]
})
export class ChannelModule {}