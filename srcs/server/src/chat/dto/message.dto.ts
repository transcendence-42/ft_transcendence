import { IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class MessageDto {
  @IsString()
  @MaxLength(128)
  content: string;

  @IsString()
  @IsNotEmpty()
  fromUserId: string;

  @IsString()
  @IsNotEmpty()
  toChannelId: string;
}
