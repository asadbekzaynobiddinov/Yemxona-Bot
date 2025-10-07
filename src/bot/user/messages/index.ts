import { Update, On, Ctx } from 'nestjs-telegraf';
import { MyContext } from 'src/common/types';
import { config } from 'src/config';

@Update()
export class UserMessages {
  @On('text')
  async handleText(@Ctx() ctx: MyContext) {
    console.log(config, ctx);
    await ctx.reply(`Rahmat! Endi botdan to'liq foydalanishingiz mumkin.`);
  }
}
