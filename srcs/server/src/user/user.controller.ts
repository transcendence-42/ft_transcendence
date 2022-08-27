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
import { Friendship } from './entities/friendship.entity';
import { CreateFriendshipDto } from './dto/create-friendship.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Creation
  @ApiTags('Users')
  @Post()
  @ApiOperation({ summary: 'create a new user' })
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

  // Get all
  @ApiTags('Users')
  @Get()
  @ApiOperation({ summary: 'get all users' })
  @ApiOkResponse({
    description: 'Array of all users',
    type: User,
    isArray: true,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiNoContentResponse({ description: 'No users', type: BaseApiException })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const res = await this.userService.findAll(paginationQuery);
    return res;
  }

  // Get by id
  @ApiTags('Users')
  @Get(':id')
  @ApiOperation({ summary: 'get user by id' })
  @ApiOkResponse({
    description: 'Found User',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async findOne(@Param('id') id: number) {
    const res = await this.userService.findOne(id);
    return res;
  }

  // Add a friend to a user
  @ApiTags('Friends')
  @Put(':id/friends')
  @ApiOperation({ summary: 'request a friendship' })
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
  async createFriendship(
    @Param('id') id: number,
    @Body() createFriendshipDto: CreateFriendshipDto,
  ) {
    const res = await this.userService.createFriendship(
      id,
      createFriendshipDto,
    );
    return res;
  }

  // Get all friends of a user
  @ApiTags('Friends')
  @Get(':id/friends')
  @ApiOperation({ summary: 'get all friends of a users' })
  @ApiOkResponse({
    description: 'Array of all friends',
    type: User,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiNoContentResponse({ description: 'No friends', type: BaseApiException })
  async getUserFriends(
    @Param('id') id: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const res = await this.userService.findUserFriends(id, paginationQuery);
    return res;
  }

  // Update
  @ApiTags('Users')
  @Patch(':id')
  @ApiOperation({ summary: 'update a user' })
  @ApiOkResponse({
    description: 'Updated user',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.userService.update(+id, updateUserDto);
    return res;
  }

  // Delete
  @ApiTags('Users')
  @Delete(':id')
  @ApiOperation({ summary: 'delete a user' })
  @ApiOkResponse({
    description: 'Deleted user',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: BaseApiException,
  })
  async remove(@Param('id') id: number) {
    const res = await this.userService.remove(+id);
    return res;
  }
}
