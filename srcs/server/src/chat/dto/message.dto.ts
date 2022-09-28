import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MessageDto {
  @IsString()
  @MaxLength(128)
  content: string;

  @IsString()
  @IsNotEmpty()
  fromUserId: number;

  @IsString()
  @IsNotEmpty()
  toChannelOrUserId: number;
}
