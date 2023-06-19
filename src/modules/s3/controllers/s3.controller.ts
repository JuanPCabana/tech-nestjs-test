import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../services/s3.service';
import { get } from 'http';
import { Response } from 'express';
import { RenameFileDto } from '../dtos/s3.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class S3Controller {

  constructor(private readonly s3Service: S3Service) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/*' })
        ]
      })
    ) file: Express.Multer.File) {
    await this.s3Service.uploadFile(file.originalname, file.buffer)
  }

  @Get(':fileName')
  @UseGuards(AuthGuard('jwt'))
  async downloadFile(@Res() res: Response, @Param('fileName') fileName: string) {
    return await this.s3Service.downloadFile(res, fileName)
  };

  @Post('rename')
  @UseGuards(AuthGuard('jwt'))
  async renameFile(@Body() body: RenameFileDto) {
    return await this.s3Service.renameFile(body)
  };

  @Get('url/:fileName')
  @UseGuards(AuthGuard('jwt'))
  async getUrl(@Param('fileName') fileName: string) {
    return await this.s3Service.getObjectUrl(fileName)
  };

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async listObjects() {
    return await this.s3Service.listObjects()
  };

}
