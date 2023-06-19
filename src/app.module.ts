import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './modules/users/controllers/users.controller';
import { UsersService } from './modules/users/services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './modules/users/models/user.model';
import { PasswordService } from './modules/auth/services/password.service';
import { EmailService } from './modules/email/services/email.service';
import { AuthService } from './modules/auth/services/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/email.module';
import { S3Module } from './modules/s3/s3.module';
import { UnsplashModule } from './modules/unsplash/unsplash.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {}),
    AuthModule,
    UsersModule,
    EmailModule,
    S3Module,
    UnsplashModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
