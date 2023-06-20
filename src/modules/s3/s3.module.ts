import { Module } from '@nestjs/common';
import { S3Controller } from './controllers/s3.controller';
import { S3Service } from './services/s3.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
        limit: configService.getOrThrow('UPLOAD_RATE_LIMIT')
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [S3Controller],
  providers: [
    S3Service,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [S3Service]
})
export class S3Module { }
