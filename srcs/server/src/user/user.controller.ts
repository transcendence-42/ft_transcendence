import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ExceptionsDto } from '../common/dto/exceptions.dto';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Creation
  @Post()
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
  @ApiOkResponse({
    description: 'Array of all users',
    type: User,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No users', type: ExceptionsDto })
  async findAll() {
    const res = await this.userService.findAll();
    return res;
  }

  // Get by id
  @Get(':id')
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
