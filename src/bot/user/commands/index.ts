import { Update, Command, Ctx } from 'nestjs-telegraf';
import { MyContext } from 'src/common/types';
import { helloUser } from 'src/common/constants';
import { config } from 'src/config';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Update()
export class UserCommands {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
  @Command('start')
  async start(@Ctx() ctx: MyContext): Promise<string | void> {
    console.log(ctx, config);
    await ctx.reply(helloUser);
  }
}
