import { Module } from '@nestjs/common';
import { UserCommands } from './commands';
import { UserActions } from './actions';
import { UserMessages } from './messages';

@Module({
  providers: [UserCommands, UserActions, UserMessages],
})
export class UserModule {}
