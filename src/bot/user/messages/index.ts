import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Update, On, Ctx } from 'nestjs-telegraf';
import { Model } from 'mongoose';
import { MyContext } from 'src/common/types';
import { User } from 'src/common/database/schemas/user.schema';
import {
  adminMenu,
  askPhoneNumber,
  chooseDepartment,
  contactText,
  uncorrectPhoneMessage,
  noAdminRights,
  referalMenu,
} from 'src/common/constants';
import { Markup } from 'telegraf';

@Update()
export class UserMessages {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  @On('text')
  async handleText(@Ctx() ctx: MyContext) {
    let user: User | undefined | null = await this.cache.get(
      `user-${ctx.from?.id}`,
    );
    if (user == undefined) {
      user = await this.userModel.findOne({ telegramId: ctx.from?.id });
      if (user == null) {
        await ctx.reply(
          "Iltimos, botdan foydalanishni boshlash uchun /start buyrug'ini bering.",
        );
        return;
      }
      await this.cache.set(`user-${ctx.from?.id}`, user);
    }
    const text = (ctx.update as { message: { text: string } }).message.text;
    switch (text) {
      case '/admin': {
        if (!user || user.role != 'admin') {
          await ctx.reply(noAdminRights[user.lang] as string, {
            parse_mode: 'HTML',
          });
          return;
        }
        await ctx.reply(chooseDepartment[user.lang] as string, {
          reply_markup: adminMenu[user.lang],
        });
        return;
      }
      case '🔗 Referal tizimi':
      case '🔗 Реферал тизими':
        if (user.role != 'admin') return;
        ctx.session.lastMessage = await ctx.reply(
          chooseDepartment[user.lang] as string,
          {
            reply_markup: {
              inline_keyboard: [...referalMenu[user.lang].inline_keyboard],
              remove_keyboard: true,
            },
          },
        );
    }
    switch (user.lastState) {
      case 'awaitName':
        user.name = text;
        user.lastState = 'awaitNumber';
        await this.cache.set(`user-${ctx.from?.id}`, user);
        await ctx.reply(askPhoneNumber[user.lang] as string, {
          reply_markup: {
            keyboard: [
              [Markup.button.contactRequest(contactText[user.lang] as string)],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
          parse_mode: 'HTML',
        });
        return;
      case 'awaitNumber': {
        const correctPhone = text.match(/^\+998[0-9]{9}$/);
        if (!correctPhone) {
          await ctx.reply(uncorrectPhoneMessage[user.lang] as string);
          return;
        }
        user.phoneNumber = text;
        user.lastState = 'active';
        await this.userModel.create(user);
        await this.cache.set(`user-${ctx.from?.id}`, user);
        await ctx.reply(
          "Siz muvaffaqiyatli ro'yxatdan o'tdingiz!",
          Markup.removeKeyboard(),
        );
        return;
      }
      default:
        break;
    }
  }

  @On('contact')
  async handleContact(@Ctx() ctx: MyContext) {
    const user: User | undefined = await this.cache.get(`user-${ctx.from?.id}`);
    if (user == undefined) return;
    const contact = (
      ctx.update as { message: { contact: { phone_number: string } } }
    ).message.contact;
    if (user.lastState !== 'awaitNumber') return;
    user.phoneNumber = contact.phone_number;
    user.lastState = 'active';
    await this.userModel.create(user);
    await this.cache.set(`user-${ctx.from?.id}`, user);
    await ctx.reply(
      "Siz muvaffaqiyatli ro'yxatdan o'tdingiz!",
      Markup.removeKeyboard(),
    );
  }
}
