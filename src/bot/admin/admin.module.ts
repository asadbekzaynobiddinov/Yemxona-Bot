import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Referal,
  ReferalSchema,
} from 'src/common/database/schemas/referal.schema';
import { User, UserSchema } from 'src/common/database/schemas/user.schema';
import { AdminActions } from './actions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Referal.name, schema: ReferalSchema },
    ]),
  ],
  providers: [AdminActions],
})
export class AdminModule {}
