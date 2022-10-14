import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PictureService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async create(id: number, picture: string): Promise<User> {
    const serverPath = this.configService.get('REACT_APP_API_URL');
    return await this.userService.update(id, {
      profilePicture: `${serverPath}/pictures/${picture}`,
    });
  }
}
