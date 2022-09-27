import { Injectable } from '@nestjs/common';
import { Rating } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserNotFoundException } from 'src/user/exceptions';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    try {
      const result: Rating = await this.prisma.rating.create({
        data: {
          rating: createRatingDto.rating,
          user: {
            connect: { id: createRatingDto.userId },
          },
        },
      });
      return result;
    } catch (e) {
      throw new UserNotFoundException(createRatingDto.userId);
    }
  }
}
