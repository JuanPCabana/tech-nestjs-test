import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../services/s3.service';
import { get } from 'http';
import { Response } from 'express';
import { RenameFileDto, UploadFileDto } from '../dtos/s3.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('S3 Files')
@Controller('files')
export class S3Controller {

  constructor(private readonly s3Service: S3Service) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image hosted in the "file" property of a multipart/form-data.' })
  async uploadFile(@Res() res: Response,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/*' })
        ]
      })
    ) file: UploadFileDto) {
    await this.s3Service.uploadFile(res, file.originalname, file.buffer)
  }

  @Get(':fileName')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Download an image from S3, using the same file name as the one stored in the S3 bucket.' })
  async downloadFile(@Res() res: Response, @Param('fileName') fileName: string) {
    return await this.s3Service.downloadFile(res, fileName)
  };

  @Post('rename')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Rename an s3 file' })
  async renameFile(@Res() res: Response, @Body() body: RenameFileDto) {
    return await this.s3Service.renameFile(res, body)
  };

  @Get('url/:fileName')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get the URL of an object from an S3 bucket.' })
  async getUrl(@Res() res: Response, @Param('fileName') fileName: string) {
    return await this.s3Service.getObjectUrl(res, fileName)
  };

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List the objects in an S3 bucket.' })
  async listObjects(@Res() res: Response,) {
    return await this.s3Service.listObjects(res)
  };

}
