import { Injectable } from '@nestjs/common';
import { LoginDto, GoogleStrategyDto, RecoveryTokenDto, ResetPasswordDto } from 'src/dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RecoveryTokenModel, User } from 'src/models/user.model';
import { Model } from 'mongoose';
import responseHandler from 'src/helpers/response.helper';
import { PasswordService } from './password.service';
import * as jwt from 'jsonwebtoken';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService
  ) { }

  async loginUser(body: LoginDto): Promise<any> {

    const { email, password } = body;

    const userInfo = await this.userModel.findOne({ email: email.toLowerCase() })
    if (!userInfo) {
      return responseHandler.handleErrorResponse(
        400,
        "Usuario o password incorrecto!"
      )
    }

    const validPassword = await this.passwordService.comparePasswords(password, userInfo.password)
    if (!validPassword) {
      return responseHandler.handleErrorResponse(
        400,
        "Usuario o password incorrecto!"
      )
    }

    delete userInfo.password
    return userInfo
  }

  async googleLogin(req) {
    const user: GoogleStrategyDto = req.user
    if (!user) {
      return 'No user from google'
    }

    const alreadyRegisteredInfo = await this.userModel.findOne({ email: user.email })
    let userInfo
    if (!alreadyRegisteredInfo) {
      const newUser = new this.userModel({
        firstName: user.firstName.toLowerCase(),
        lastName: user.lastName.toLowerCase(),
        email: user.email.toLowerCase(),
        role: 'user',
      })
      userInfo = await newUser.save()
    }
    else {
      delete alreadyRegisteredInfo.password
      userInfo = alreadyRegisteredInfo
    }

    const token = jwt.sign({ _id: userInfo._id }, process.env.JWT_SECRET_KEY)
    const response = {
      user: userInfo,
      token
    }
    return responseHandler.handleResponse(response)

  }

  validateUserById(tokenPayload: any) {
    return this.userModel.findOne({ _id: tokenPayload._id })
  }

  async generateRecoveryToken(payload: RecoveryTokenDto) {

    const user = await this.userModel.findOne({ email: payload.email.toLowerCase() })
    if (!user) {
      return responseHandler.handleErrorResponse(
        400,
        "No existe un usuario con ese email!"
      )
    }
    const token = this.generateRandomToken(6)
    const expirationDate = new Date(Date.now()).getTime() + 3600 * 1000

    const tokenInfo: RecoveryTokenModel = {
      token: token,
      expirationDate
    }

    await this.userModel.updateOne({ _id: user._id }, { $set: { recoveryToken: tokenInfo } })

    await this.emailService.sendEmail(user.email, 'Codigo de recuperacion de contraseña', `El codigo para restaurar su contraseña es: ${token}`)

    return responseHandler.handleResponse({}, 'Token enviado correctamente')
  }

  generateRandomToken(length: number): string {
    const buffer = randomBytes(Math.ceil(length / 2));
    const token = buffer.toString('hex').slice(0, length);

    return token.toUpperCase();
  }

  async validateRecoveryToken(payload: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: payload.email.toLowerCase() })

    if (user.recoveryToken.token !== payload.token) {
      return responseHandler.handleErrorResponse(
        400,
        "El token de recuperacion es incorrecto!"
      )
    }

    if (user.recoveryToken.expirationDate < Date.now()) {
      return responseHandler.handleErrorResponse(
        400,
        "El token de recuperacion ha expirado!"
      )
    }

    const hashedPassword = await this.passwordService.hashPassword(payload.password)
    await this.userModel.updateOne({ _id: user._id }, { $set: { password: hashedPassword }, $unset: { recoveryToken: 0 } })

    return responseHandler.handleResponse({}, 'Contraseña actualizada correctamente!')
  }
}