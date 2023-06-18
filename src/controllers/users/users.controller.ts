import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AddUserDto } from 'src/dtos/users.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/services/users/users.service';
import { User } from 'src/models/user.model';
import { Model } from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService, @InjectModel(User.name) private readonly userModel: Model<User>) { }


    @Post()
    async addUser(@Body() payload: AddUserDto) {

        const userInfo = new this.userModel(payload)
        const resp = await this.userService.create(userInfo)
        console.log(resp)
        return { msg: 'Creado usuario correctamente', user: resp };
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
