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
  UseGuards,
} from '@nestjs/common';
import { AddUserDto, UpdateUserDto } from '../dtos/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.model';
import { Model, ObjectId, Types } from 'mongoose';
import responseHandler from 'src/helpers/response.helper';
import { PasswordService } from 'src/modules/auth/services/password.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by objectId' })
  async getUser(@Res() res: Response, @Param('userId') userId: string) {
    let userObjectId: Types.ObjectId
    try {
      userObjectId = new Types.ObjectId(userId)
      const userInfo = (await this.userService.findByUserId(userObjectId))

      if (!userInfo) {
        throw new Error('Usuario no encontrado!')
      }

      let returnUser = userInfo
      delete returnUser.password
      return responseHandler.handleResponse(res, returnUser);

    } catch (error) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        'El usuario no existe!'
      );
    }
  }

  //updateUser
  @Patch(':userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by objectId' })
  async updateUser(@Res() res: Response, @Param('userId') userId: string, @Body() body: UpdateUserDto) {
    try {
      const userObjectId = new Types.ObjectId(userId)
      if (Object.keys(body).length === 0) {
        throw new Error('No hay datos para actualizar!')
      }
      await this.userService.updateByUserId(userObjectId, body)

      return responseHandler.handleResponse(res, {}, 'Usuario actualizado correctamente!');
    } catch (error) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        'No se ha podido actualizar el usuario!'
      );
    }
    return body;
  }

  //deleteUser
  @Delete(':userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User by objectId' })
  async deleteUser(@Res() res: Response, @Param('userId') userId: string) {
    let userObjectId: Types.ObjectId
    try {
      userObjectId = new Types.ObjectId(userId)
      const userInfo = (await this.userService.findByUserId(userObjectId))

      if (!userInfo) {
        throw new Error('Usuario no encontrado!')
      }

      let returnUser = userInfo
      delete returnUser.password
      return responseHandler.handleResponse(res, returnUser, 'Usuario eliminado correctamente!');

    } catch (error) {
      return responseHandler.handleErrorResponse(
        res,
        400,
        'El usuario no existe!'
      );
    }
  }

  //getAllUsers
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Users' })
  async getUsers(
    @Res() res: Response,
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
  ) {

    const userList = await this.userService.getAll(limit, offset)

    const returnUserList = userList.map(user => {
      let userInfo = user.toObject()
      delete userInfo.password
      return userInfo
    })

    return responseHandler.handleResponse(res, returnUserList);
  }
}
