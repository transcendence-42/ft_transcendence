import { PickType } from '@nestjs/swagger';
import { UpdateGameDto } from './update-game.dto';

export class GetGameInfoDto extends PickType(UpdateGameDto, ['id'] as const) {}
