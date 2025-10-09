import { Module } from '@nestjs/common';
import { UserCommands } from './commands';
import { UserActions } from './actions';
import { UserMessages } from './messages';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/database/schemas/user.schema';
import {
  Referal,
  ReferalSchema,
} from 'src/common/database/schemas/referal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Referal.name, schema: ReferalSchema },
    ]),
  ],
  providers: [UserCommands, UserActions, UserMessages],
})
export class UserModule {}
