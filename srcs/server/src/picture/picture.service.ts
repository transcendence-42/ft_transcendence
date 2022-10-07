import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PictureService {
  constructor(private readonly userService: UserService) {}

  async create(id: number, picture: string): Promise<User> {
    return await this.userService.update(id, { profilePicture: picture });
  }
}
