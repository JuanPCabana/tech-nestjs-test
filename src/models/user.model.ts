import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class RecoveryTokenModel {
  @Prop({})
  token: string;
  @Prop({})
  expirationDate: number;
}
@Schema()
export class User extends Document {
  // @Prop()
  // id: number;
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({})
  password: string;
  @Prop({ default: 'user' })
  role: string
  @Prop({})
  recoveryToken: RecoveryTokenModel;
}



export const UserSchema = SchemaFactory.createForClass(User);
