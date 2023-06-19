import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { LoginDto } from 'src/dtos/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(body: LoginDto): Promise<any> {
    const user = await this.authService.loginUser(body);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}