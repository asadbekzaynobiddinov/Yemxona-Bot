import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'cart' })
export class Cart extends Document {
  @Prop({ required: true, ref: 'users', type: Types.ObjectId })
  userId: string;

  @Prop({ required: true, type: Array })
  products: { name: string; price: number; quantity: number; unit: string }[];

  @Prop({ required: true })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
