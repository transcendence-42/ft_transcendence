import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, MaxLength, ValidateNested } from 'class-validator';

export class MessageDto {
  @IsString()
  @MaxLength(128)
  content: string;

  @IsNumber()
  date: number;

  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
