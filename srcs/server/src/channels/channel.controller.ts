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
import { Logger } from 'nestjs-pino';

@ApiTags('Channels')
@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly logger: Logger,
  ) {}

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.findOne(id);
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
  findAll(@Query() paginationQuerry: PaginationQueryDto) {
    return this.channelService.findAll(paginationQuerry);
  }

  @Put()
  @ApiOperation({ summary: 'Creates a channel' })
  @ApiOkResponse({
    description: 'the create channels',
    type: Channel,
    isArray: false,
  })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    this.logger.log(
      `This is request object ${JSON.stringify(updateChannelDto, null, 4)}`,
    );
    return this.channelService.update(id, updateChannelDto);
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
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.delete(id);
  }

  @Put(':id/useronchannel')
  @ApiOperation({ summary: 'Creates a user on a channel' })
  @ApiOkResponse({ description: 'Craeted Channel', type: Channel })
  createUserOnChannel(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserOnChannelDto: CreateUserOnChannelDto,
  ) {
    return this.channelService.createUserOnChannel(createUserOnChannelDto);
  }

  @Patch(':id/useronchannel/:userid')
  updateUserOnChannel(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userId: number,
    @Body() updateUserOnChannelDto: UpdateUserOnChannelDto,
  ) {
    return this.channelService.updateUserOnChannel(
      id,
      userId,
      updateUserOnChannelDto,
    );
  }
  @Delete(':id/useronchannel/:userid')
  deleteUserOnChannel(
    @Param('id', ParseIntPipe) id: number,
    @Param('userid', ParseIntPipe) userId: number,
  ) {
    return this.channelService.deleteUserOnChannel(id, userId);
  }
}
