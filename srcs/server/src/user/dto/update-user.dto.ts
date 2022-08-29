import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'status of the user : 0=away, 1=here, 2=playing',
    example: '1',
  })
  readonly profilePicture?: string;
}
