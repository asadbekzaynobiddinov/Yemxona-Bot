import { Action, Update, Ctx } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { MyContext } from 'src/common/types';
import { askName } from 'src/common/constants';
import { config } from 'src/config';

@Update()
export class UserActions {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
  @Action('setLangUz')
  async setLangUz(@Ctx() ctx: MyContext) {
    console.log('Before Update Cached User:', config);
    await ctx.editMessageText(askName.uz);
  }

  @Action('setLangUzKrill')
  async setLangUzKrill(@Ctx() ctx: MyContext) {
    console.log('Before Update Cached User:', config);
    await ctx.editMessageText(askName.kr);
  }
}
