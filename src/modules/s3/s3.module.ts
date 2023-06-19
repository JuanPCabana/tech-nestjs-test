import { Module } from '@nestjs/common';
import { S3Controller } from './controllers/s3.controller';
import { S3Service } from './services/s3.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
        limit: configService.getOrThrow('UPLOAD_RATE_LIMIT')
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [S3Controller],
  providers: [
    S3Service,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class S3Module { }
