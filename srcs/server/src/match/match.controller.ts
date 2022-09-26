import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Match } from './entities/match.entity';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Matches')
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // USER CRUD OPERATIONS ------------------------------------------------------
  /** Create a new match */
  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiCreatedResponse({
    description: 'Created match',
    type: Match,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: BaseApiException,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async create(@Body() createMatchDto: CreateMatchDto) {
    const res = await this.matchService.create(createMatchDto);
    return res;
  }

  /** Get all matches */
  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiOkResponse({
    description: 'Array of all matches',
    type: Match,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No matches' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const res = await this.matchService.findAll(paginationQuery);
    return res;
  }

  /** Get match by id */
  @Get(':id')
  @ApiOperation({ summary: 'Get match by id' })
  @ApiOkResponse({
    description: 'Found Match',
    type: Match,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Match not found',
    type: BaseApiException,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const res = await this.matchService.findOne(id);
    return res;
  }

  /** Delete match */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a match' })
  @ApiOkResponse({
    description: 'Deleted match',
    type: Match,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Match not found',
    type: BaseApiException,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const res = await this.matchService.remove(+id);
    return res;
  }
}
