import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { User, UserSchema } from 'src/models/user.model';
import { JwtStrategy } from 'src/oAuth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/oAuth/strategies/local.strategy';
import { AuthService } from 'src/services/auth/auth.service';
import { PasswordService } from 'src/services/auth/password.service';
import { EmailService } from 'src/services/email/email.service';

@Module({
  imports: [
    PassportModule,
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordService, EmailService],
})
export class AuthModule { }