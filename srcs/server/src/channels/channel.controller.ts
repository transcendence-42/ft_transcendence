import {
  Delete,
  Put,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Body,
  Patch,
  Logger,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Channel } from 'src/generated/nestjs-dto/channel.entity';
import { ChannelService } from './channel.service';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import {
  CreateChannelDto,
  UpdateChannelDto,
  CreateUserOnChannelDto,
  UpdateUserOnChannelDto,
} from './dto';
import { UserOnChannel } from 'src/generated/nestjs-dto/userOnChannel.entity';

@ApiTags('Channels')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  private readonly logger = new Logger(ChannelController.name);
  @Get(':id')
  @ApiOperation({ summary: 'Get channel by id' })
  @ApiOkResponse({
    description: 'Found channel',
    type: Channel,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Channel not found',
    type: BaseApiException,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.channelService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all channels' })
  @ApiOkResponse({
    description: 'Array of all channels',
    type: Channel,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No channels' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findAll(@Query() paginationQuerry?: PaginationQueryDto) {
    return await this.channelService.findAll(paginationQuerry);
  }

  @Put()
  @ApiOperation({ summary: 'Creates a channel' })
  @ApiOkResponse({
    description: 'the create channels',
    type: Channel,
    isArray: false,
  })
  async create(@Body() createChannelDto: CreateChannelDto) {
    return await this.channelService.create(createChannelDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a channel' })
  @ApiOkResponse({
    description: 'Updated channel',
    type: Channel,
  })
  @ApiNotFoundResponse({
    description: 'Channel not found',
    type: BaseApiException,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    this.logger.log(
      `This is request object ${JSON.stringify(updateChannelDto, null, 4)}`,
    );
    return await this.channelService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a channel' })
  @ApiOkResponse({
    description: 'Deletes channel',
    type: Channel,
  })
  @ApiNotFoundResponse({
    description: 'Channel not found',
    type: BaseApiException,
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    this.logger.debug(`Deleting from delete channel`);
    return await this.channelService.delete(id);
  }

  @Get(':id/useronchannel/:userid')
  @ApiOperation({ summary: 'Find userOnChannel' })
  @ApiOkResponse({ description: 'user on channel', type: UserOnChannel })
  async findUserOnChannel(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userId: number,
  ) {
    return await this.channelService.findUserOnChannel(id, userId);
  }

  @Put(':id/useronchannel')
  @ApiOperation({ summary: 'Creates a user on a channel' })
  @ApiOkResponse({ description: 'Created Channel', type: Channel })
  async createUserOnChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserOnChannelDto: CreateUserOnChannelDto,
  ) {
    return await this.channelService.createUserOnChannel(
      createUserOnChannelDto,
    );
  }

  @Patch(':id/useronchannel/:userid')
  @ApiOperation({ summary: 'Updates a user on a channel' })
  @ApiOkResponse({ description: 'Updated Channel', type: Channel })
  async updateUserOnChannel(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userId: number,
    @Body() updateUserOnChannelDto: UpdateUserOnChannelDto,
  ) {
    this.logger.debug(`Trying to patch channel ${id} with userid ${userId}`);
    return await this.channelService.updateUserOnChannel(
      id,
      userId,
      updateUserOnChannelDto,
    );
  }
  @Delete(':id/useronchannel/:userid')
  async deleteUserOnChannel(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userId: number,
  ) {
    this.logger.debug(`trying to delete channel ${id}`);
    return await this.channelService.deleteUserOnChannel(id, userId);
  }
}
