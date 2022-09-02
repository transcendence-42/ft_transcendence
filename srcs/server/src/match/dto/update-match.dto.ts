import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

enum MatchStatus {
  CREATED,
  STARTED,
  FINISHED,
}

export class UpdateMatchDto {
  @IsNumber()
  @ApiProperty({
    description: 'status of the match: 0=created, 1=started, 2=finished',
    example: '2',
  })
  readonly status: MatchStatus;
}
