import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
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
import { UpdateChannelDto } from 'src/generated/nestjs-dto/update-channel.dto';

@Controller('channel')
@ApiTags('Channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiOperation({ summary: 'Get a single channel' })
  @ApiOkResponse({
    description: 'a channel object',
    type: Channel,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Channel not found',
    type: BaseApiException,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.findOne(id);
  }

  @ApiOperation({ summary: 'Get all channels' })
  @ApiOkResponse({
    description: 'Array of all channels',
    type: Channel,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No channels' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @Get()
  findAll(@Query() paginationQuerry: PaginationQueryDto) {
    return this.channelService.findAll(paginationQuerry);
  }

  @ApiOperation({summary: 'Updates a channel'})
  @ApiOkResponse({
    description: 'Updated channel'
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelService.update(id, updateChannelDto);
  }
}
