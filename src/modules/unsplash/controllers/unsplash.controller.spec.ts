import { Test, TestingModule } from '@nestjs/testing';
import { UnsplashController } from './unsplash.controller';
import { UnsplashModule } from '../unsplash.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UnsplashController', () => {
  let controller: UnsplashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UnsplashModule, ConfigModule.forRoot(),],
    })
      .compile();

    controller = module.get<UnsplashController>(UnsplashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
