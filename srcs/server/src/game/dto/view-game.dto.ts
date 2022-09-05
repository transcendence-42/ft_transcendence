import { PickType } from '@nestjs/swagger';
import { UpdateGameDto } from './update-game.dto';

export class ViewGameDto extends PickType(UpdateGameDto, ['id'] as const) {}
