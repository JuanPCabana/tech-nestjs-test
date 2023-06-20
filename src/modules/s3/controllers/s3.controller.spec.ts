import { Test, TestingModule } from '@nestjs/testing';
import { S3Controller } from './s3.controller';
import { S3Module } from '../s3.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('S3Controller', () => {
  let controller: S3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), S3Module],
    })
    
      .compile();

    controller = module.get<S3Controller>(S3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
