import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends CreateMatchDto {
  @IsNumber()
  @ApiProperty({
    description: 'status of the match: 0=created, 1=started, 2=finished',
    example: '2',
  })
  readonly status: number;
}
