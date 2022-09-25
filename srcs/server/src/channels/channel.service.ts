import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChannelService { 
    constructor(private readonly prisma: PrismaService) {}

    findOne(channelId: number) {

    }

    findAll() {

    }

    deleteOne(channelId: number) {

    }

    deleteMany() {

    }

    updateOne(updateChannelDto) {

    }


}