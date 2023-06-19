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
  Res,
} from '@nestjs/common';
import { AddUserDto } from '../dtos/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.model';
import { Model, ObjectId } from 'mongoose';
import responseHandler from 'src/helpers/response.helper';
import { PasswordService } from 'src/modules/auth/services/password.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: PasswordService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  //Add user
  @Post()
  @ApiOperation({ summary: 'Register a user' })
  async addUser(@Res() res: Response, @Body() payload: AddUserDto) {
    const userInfo = new this.userModel(payload);
    const exist = await this.userService.findByEmail(userInfo.email)
    if (exist) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        'El usuario ya existe!'
      );
    }
    const encriptedPass = await this.authService.hashPassword(
      userInfo.password,
    );
    userInfo.password = encriptedPass;
    const queryResult = await this.userService.create(userInfo);
    const createdUser = queryResult.toObject()
    delete createdUser.password
    return responseHandler.handleResponse(
      res,
      createdUser,
      'Usuario creado correctamente!',
      201
    );
  }

  //getUserById
  @Get(':userId')
  @ApiOperation({ summary: 'Get user by objectId' })

  getUser(@Param('userId') userId: ObjectId) {
    return `Info del usuario: ${userId}`;
  }

  //updateUser
  @Patch()
  @ApiOperation({ summary: 'Update user by objectId' })
  updateUser(@Body('userId') userId: string) {
    return `actualizado usuario: ${userId}`;
  }

  //deleteUser
  @Delete()
  @ApiOperation({ summary: 'Delete User by objectId' })
  deleteUser(@Body('userId') userId: string) {
    return `Info del usuario: ${userId}`;
  }

  //getAllUsers
  @Get()
  @ApiOperation({ summary: 'Get all Users' })
  getUsers(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('role') role: string,
  ) {
    return `Role:${role} limit: ${limit} : offset: ${offset}`;
  }
}
