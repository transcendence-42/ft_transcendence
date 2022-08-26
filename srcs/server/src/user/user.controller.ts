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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BaseApiException } from 'src/common/exceptions/baseApiException.entity';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Creation
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

  // Update
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
