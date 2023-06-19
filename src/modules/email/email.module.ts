import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
