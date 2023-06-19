import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AddUserDto } from '../dtos/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import responseHandler from 'src/helpers/response.helper';
import { PasswordService } from 'src/modules/auth/services/password.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: PasswordService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  //Add user
  @Post()
  async addUser(@Body() payload: AddUserDto) {
    const userInfo = new this.userModel(payload);
    const exist = await this.userService.findByEmail(userInfo.email)
    if (exist) {
      return responseHandler.handleErrorResponse(
        400,
        'El usuario ya existe!'
      );
    }
    const encriptedPass = await this.authService.hashPassword(
      userInfo.password,
    );
    userInfo.password = encriptedPass;
    const resp = await this.userService.create(userInfo);
    return responseHandler.handleResponse(
      resp,
      'Usuario creado correctamente!',
    );
  }

  //getUserById
  @Get(':userId')
  //el parseIntPipe funciona para transformar de string a number los query params
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return `Info del usuario: ${userId}`;
  }

  //updateUser
  @Patch()
  updateUser(@Body('userId') userId: string) {
    return `actualizado usuario: ${userId}`;
  }

  //deleteUser
  @Delete()
  deleteUser(@Body('userId') userId: string) {
    return `Info del usuario: ${userId}`;
  }

  //getAllUsers
  @Get()
  getUsers(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('role') role: string,
  ) {
    return `Role:${role} limit: ${limit} : offset: ${offset}`;
  }
}
