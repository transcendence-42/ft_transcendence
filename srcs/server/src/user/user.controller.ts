import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { User } from './entities/user.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { RequestFriendshipDto } from './dto/request-friendship.dto';
import { Rating } from './entities/rating.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // USER CRUD OPERATIONS ------------------------------------------------------
  /** Create a new user */
  @ApiTags('Users')
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'Created user',
    type: User,
    isArray: false,
  })
  @ApiConflictResponse({
    description: 'User already exists',
    type: BaseApiException,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.create(createUserDto);
    return res;
  }

  /** Get all users */
  @ApiTags('Users')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Array of all users',
    type: User,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No users' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const res = await this.userService.findAll(paginationQuery);
    return res;
  }

  /** Get user by id */
  @ApiTags('Users')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({
    description: 'Found User',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const res = await this.userService.findOne(id);
    return res;
  }

  /** Update user by id */
  @ApiTags('Users')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({
    description: 'Updated user',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const res = await this.userService.update(+id, updateUserDto);
    return res;
  }

  /** Delete user */
  @ApiTags('Users')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({
    description: 'Deleted user',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const res = await this.userService.remove(+id);
    return res;
  }

  // FRIENDSHIP OPERATIONS -----------------------------------------------------
  /** Request a friendship */
  @ApiTags('Friends')
  @Put(':id/friends')
  @ApiOperation({ summary: 'Request a friendship' })
  @ApiCreatedResponse({
    description: 'New friendship requested, or previous request accepted',
    type: Friendship,
    isArray: false,
  })
  @ApiOkResponse({
    description: 'Already existing friendship with no status change',
    type: BaseApiException,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async requestFriendship(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestFriendshipDto: RequestFriendshipDto,
  ) {
    const res = await this.userService.requestFriendship(
      id,
      requestFriendshipDto,
    );
    return res;
  }

  /** Get all friends for a user */
  @ApiTags('Friends')
  @Get(':id/friends')
  @ApiOperation({ summary: 'Get all friends of a users' })
  @ApiOkResponse({
    description: 'Array of all friends',
    type: User,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  @ApiNoContentResponse({ description: 'No friends' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getUserFriends(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const res = await this.userService.findUserFriends(id, paginationQuery);
    return res;
  }

  // RATING OPERATIONS ---------------------------------------------------------
  /** Get rating history for a user */
  @ApiTags('Elo ratings')
  @Get(':id/ratings')
  @ApiOperation({ summary: 'History of all ratings of a user' })
  @ApiOkResponse({
    description: 'Array of all ratings',
    type: Rating,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getUserRatings(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const res = await this.userService.findUserRatings(id, paginationQuery);
    return res;
  }
}
