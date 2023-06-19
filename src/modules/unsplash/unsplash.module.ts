import { Module } from '@nestjs/common';
import { UnsplashService } from './services/unsplash.service';
import { UnsplashController } from './controllers/unsplash.controller';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  providers: [UnsplashService],
  controllers: [UnsplashController]
})
export class UnsplashModule { }
