import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class ResponseUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @ApiProperty({
    description: 'database id of the user',
    example: 8,
  })
  readonly id: number;
}
