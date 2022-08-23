import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class ResponseUserDto extends PickType(CreateUserDto, [
  'email',
  'username',
] as const) {
  @IsNumber()
  readonly id: number;
}
