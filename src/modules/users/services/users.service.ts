import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { User } from '../models/user.model';
import { UpdateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async create(userDto: User): Promise<User> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async findByEmail(email: String): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() })
  }

  async findByUserId(userId: Types.ObjectId): Promise<User> {
    return this.userModel.findOne({ _id: userId })
  }

  async deleteByUserId(userId: Types.ObjectId): Promise<User> {
    return this.userModel.findOneAndDelete({ _id: userId })
  }

  async updateByUserId(userId: Types.ObjectId, newProps: UpdateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id: userId }, { $set: { ...newProps } })
  }

  async getAll(limit: number, offset: number) {
    return this.userModel.find().skip(offset).limit(limit)
  }

}
