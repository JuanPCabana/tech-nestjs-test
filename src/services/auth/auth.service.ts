import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly secretKey = 'tu_clave_secreta'; // Reemplaza con tu propia clave secreta

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }


  generatePasswordResetToken(userId: string): string {
    const payload = { userId };
    const options = { expiresIn: '1h' }; // Opcional: establece la expiración del token, ej: '1h', '30m', '7d', etc.
    return jwt.sign(payload, this.secretKey, options);
  }

  verifyPasswordResetToken(token: string): string | object {
    try {
      const payload = jwt.verify(token, this.secretKey);
      return payload;
    } catch (error) {
      console.error('Error al verificar el token:', error);
      return null;
    }
  }

}
