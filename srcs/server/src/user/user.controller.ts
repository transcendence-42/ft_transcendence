import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Main information of created user',
    type: ResponseUserDto,
    isArray: false,
  })
  create(@Res() response: Response, @Body() createUserDto: CreateUserDto) {
    if (this.userService.doesUserExists(createUserDto)) {
      response.status(HttpStatus.OK).json({
        message: 'User already exists',
      });
    } else {
      return this.userService.create(createUserDto);
    }
  }

  @Get()
  @ApiOkResponse({
    description: 'Array of all users',
    type: User,
    isArray: true,
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'User object',
    type: User,
    isArray: false,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
