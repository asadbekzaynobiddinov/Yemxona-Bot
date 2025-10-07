import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'orders' })
export class Orders extends Document {
  @Prop({ required: true, ref: 'users', type: Types.ObjectId })
  userId: string;

  @Prop({ required: true, type: Array })
  products: { name: string; price: number; quantity: number; unit: string }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: false })
  address: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
