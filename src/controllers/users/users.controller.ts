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
import { AddUserDto } from 'src/dtos/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/services/users/users.service';
import { User } from 'src/models/user.model';
import { Model } from 'mongoose';
import { AuthService } from 'src/services/auth/auth.service';
import responseHandler from 'src/helpers/response.helper';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

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
      'Usuario creado correctamente!',
      resp
    );
  }

  @Get(':userId')
  //el parseIntPipe funciona para transformar de string a number los query params
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return `Info del usuario: ${userId}`;
  }

  @Patch()
  updateUser(@Body('userId') userId: string) {
    return `actualizado usuario: ${userId}`;
  }

  @Delete()
  deleteUser(@Body('userId') userId: string) {
    return `Info del usuario: ${userId}`;
  }

  @Get()
  getUsers(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('role') role: string,
  ) {
    return `Role:${role} limit: ${limit} : offset: ${offset}`;
  }
}
