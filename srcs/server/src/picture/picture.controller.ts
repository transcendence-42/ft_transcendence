import {
  Controller,
  Get,
  Res,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Request,
  UseFilters,
} from '@nestjs/common';
import { PictureService } from './picture.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import path = require('path');
import { User } from 'src/user/entities/user.entity';
import { HttpExceptionsFilter } from './exceptions/picture.exception.filter';

@UseFilters(new HttpExceptionsFilter())
@Controller('pictures')
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  /** Upload a new picture for a user */
  @ApiTags('Pictures')
  @ApiOperation({ summary: 'Upload a new picture for a user' })
  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      limits: {
        fileSize: 3 * 1000 * 1000,
      },
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + v4();
          const extension: string = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  @ApiCreatedResponse({
    description: 'Updated user',
    type: User,
    isArray: false,
  })
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3000000 }),
          new FileTypeValidator({
            fileType: new RegExp('/jpg|jpeg|png|gif/', 'ig'),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ): Promise<User> {
    const userId: number = req.user.id;
    return await this.pictureService.create(userId, file.filename);
  }

  @ApiTags('Pictures')
  @ApiOperation({ summary: 'Get a picture by id' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: any): Promise<any> {
    res.sendFile(id, { root: 'files' });
  }
}
