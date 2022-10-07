import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateOneChannelDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @ValidateNested({ each: true })
  @IsString()
  @IsNotEmpty()
  administratorsId: string[];

  @ValidateNested({ each: true })
  @IsString()
  @IsNotEmpty()
  usersList: string[];
}
