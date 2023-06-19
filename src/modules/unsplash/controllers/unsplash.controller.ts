import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UnsplashService } from '../services/unsplash.service';
import { S3Service } from 'src/modules/s3/services/s3.service';
import { UploadedFileByUrlDto } from 'src/modules/s3/dtos/s3.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('unsplash')
export class UnsplashController {

  constructor(
    private readonly unsplashService: UnsplashService,
    private readonly s3Service: S3Service
  ) { }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async searchImages(@Query('query') query: string) {
    return await this.unsplashService.searchImages(query);
  }

  @Post('s3Upload')
  @UseGuards(AuthGuard('jwt'))
  async uploadFileToS3(@Body() body: UploadedFileByUrlDto) {
    return await this.s3Service.uploadFileByUrl(body);
  }

}
