import { IsNotEmpty, IsString } from "class-validator";

export class TwoFactorDto {

    @IsNotEmpty()
    @IsString()
    code: string;
}