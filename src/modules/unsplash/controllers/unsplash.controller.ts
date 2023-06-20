import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { UnsplashService } from '../services/unsplash.service';
import { S3Service } from 'src/modules/s3/services/s3.service';
import { UploadedFileByUrlDto } from 'src/modules/s3/dtos/s3.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Unsplash')
@Controller('unsplash')
export class UnsplashController {

  constructor(
    private readonly unsplashService: UnsplashService,
    private readonly s3Service: S3Service
  ) { }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search for an image in the Unsplash API.' })
  async searchImages(@Res() res: Response, @Query('query') query: string) {
    return await this.unsplashService.searchImages(res, query);
  }

  @Post('s3Upload')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file to S3 from an external API using only the image URL.' })
  async uploadFileToS3(@Res() res: Response, @Body() body: UploadedFileByUrlDto) {
    return await this.s3Service.uploadFileByUrl(res, body);
  }

}
