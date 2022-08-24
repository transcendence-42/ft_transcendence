import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { ResponseUserDto } from './dto/response-user.dto';
import { ExceptionsDto } from '../common/dto/exceptions.dto';
import { User } from './entities/user.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Creation
  @Post()
  @ApiOperation({ summary: 'create a new user' })
  @ApiCreatedResponse({
    description: 'Main information of created user',
    type: ResponseUserDto,
    isArray: false,
  })
  @ApiConflictResponse({
    description: 'User already exists',
    type: ExceptionsDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.create(createUserDto);
    return res;
  }

  // Get all
  @Get()
  @ApiOperation({ summary: 'get all users' })
  @ApiOkResponse({
    description: 'Array of all users',
    type: User,
    isArray: true,
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiNoContentResponse({ description: 'No users', type: ExceptionsDto })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const res = await this.userService.findAll(paginationQuery);
    return res;
  }

  // Get by id
  @Get(':id')
  @ApiOperation({ summary: 'get user by id' })
  @ApiOkResponse({
    description: 'User object',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'User not found', type: ExceptionsDto })
  async findOne(@Param('id') id: string) {
    const res = await this.userService.findOne(+id);
    return res;
  }

  // Update
  @Patch(':id')
  @ApiOperation({ summary: 'update a user' })
  @ApiOkResponse({
    description: 'Updated object',
    type: UpdateUserDto,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'User not found', type: ExceptionsDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.userService.update(+id, updateUserDto);
    return res;
  }

  // Delete
  @Delete(':id')
  @ApiOperation({ summary: 'delete a user' })
  @ApiOkResponse({
    description: 'Deleted user main infos',
    type: ResponseUserDto,
    isArray: false,
  })
  @ApiNotFoundResponse({ description: 'User not found', type: ExceptionsDto })
  async remove(@Param('id') id: string) {
    const res = await this.userService.remove(+id);
    return res;
  }
}
