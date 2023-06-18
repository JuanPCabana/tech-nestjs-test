import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  // @Prop()
  // id: number;
  @Prop()
  nombre: string;
  @Prop()
  apellido: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  rol: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
