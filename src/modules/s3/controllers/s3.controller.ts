import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../services/s3.service';
import { get } from 'http';
import { Response } from 'express';
import { RenameFileDto } from '../dtos/s3.dto';

@Controller('files')
export class S3Controller {

  constructor(private readonly s3Service: S3Service) { }

  @Post()
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
    console.log(file);
    await this.s3Service.uploadFile(file.originalname, file.buffer)
  }

  @Get(':fileName')
  async downloadFile(@Res() res: Response, @Param('fileName') fileName: string) {
    return await this.s3Service.downloadFile(res, fileName)
  };

  @Post('rename')
  async renameFile(@Body() body: RenameFileDto) {
    return await this.s3Service.renameFile(body)
  };

  @Get('url/:fileName')
  async getUrl(@Param('fileName') fileName: string) {
    return await this.s3Service.getObjectUrl(fileName)
  };

  @Get('')
  async listObjects() {
    return await this.s3Service.listObjects()
  };

}
