import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Match } from './entities/match.entity';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';

@ApiTags('Matches')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // USER CRUD OPERATIONS ------------------------------------------------------
  /** Create a new match */
  @Post()
  @ApiOperation({ summary: 'create a new match' })
  @ApiCreatedResponse({
    description: 'Created match',
    type: Match,
    isArray: false,
  })
  @ApiConflictResponse({
    description: 'Match already exists',
    type: BaseApiException,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: BaseApiException,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  @ApiOkResponse({
    description: 'Player(s) not available',
    type: BaseApiException,
  })
  async create(@Body() createMatchDto: CreateMatchDto) {
    const res = await this.matchService.create(createMatchDto);
    return res;
  }

  @Get()
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(+id);
  }
}
