import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../dtos/auth.dto';
import { Response } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(res: Response, body: LoginDto): Promise<any> {
    const user = await this.authService.loginUser(res, body);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}