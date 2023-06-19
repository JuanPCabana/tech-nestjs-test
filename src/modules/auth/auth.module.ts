import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { User, UserSchema } from '../users/models/user.model';
import { JwtStrategy } from './oAuth/strategies/jwt.strategy';
import { LocalStrategy } from './oAuth/strategies/local.strategy';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './oAuth/strategies/google.strategy';


@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    AuthModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService, GoogleStrategy],
  exports: [AuthService, PasswordService],
})
export class AuthModule { }