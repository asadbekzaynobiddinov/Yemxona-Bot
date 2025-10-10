import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inject, UseGuards } from '@nestjs/common';
import { Update, Action, Ctx } from 'nestjs-telegraf';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { MyContext } from 'src/common/types';
import { config } from 'src/config';
import { Referal } from 'src/common/database/schemas/referal.schema';
import {
  backFromReferalList,
  chooseDepartment,
  createdDate,
  noReferals,
  referalCreated,
  referalMenu,
} from 'src/common/constants';
import { User } from 'src/common/database/schemas/user.schema';
import { LastMessageGuard } from 'src/common/guards/lastMessage.guard';
import { LanguageGuard } from 'src/common/guards/language.guard';

@UseGuards(AdminGuard)
@UseGuards(LanguageGuard)
@UseGuards(LastMessageGuard)
@Update()
export class AdminActions {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectModel(Referal.name) private referalModel: Model<Referal>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  @Action('addReferal')
  async addReferal(@Ctx() ctx: MyContext) {
    let user: User | undefined | null = await this.cache.get(
      `user-${ctx.from?.id}`,
    );
    if (!user) {
      user = await this.userModel.findOne({ telegramId: ctx.from?.id });
      if (!user) return;
    }
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const code = Array.from(
      { length: 10 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');

    const referal = `https://t.me/${config.BOT_USERNAME}?start=${code}`;

    await this.referalModel.create({
      referalBody: referal,
      referredBy: ctx.from?.id,
    });

    await ctx.answerCbQuery(referalCreated[user.lang] as string, {
      show_alert: true,
    });
  }

  @Action('listOfReferals')
  async listOfReferals(@Ctx() ctx: MyContext) {
    let user: User | undefined | null = await this.cache.get(
      `user-${ctx.from?.id}`,
    );
    if (!user) {
      user = await this.userModel.findOne({ telegramId: ctx.from?.id });
      if (!user) return;
    }
    const referals = await this.referalModel
      .find({ referredBy: ctx.from?.id })
      .sort({ createdAt: -1 });

    if (referals.length == 0) {
      await ctx.answerCbQuery(noReferals[user.lang] as string, {
        show_alert: true,
      });
      return;
    }

    let text: string = '';
    for (const ref of referals) {
      text += `${createdDate[user.lang]} ${ref.createdAt.split('GMT')[0]}\n <code>${ref.referalBody}</code>\n\n`;
    }
    await ctx.editMessageText(text, {
      reply_markup: backFromReferalList[ctx.session.lang],
      parse_mode: 'HTML',
    });
  }

  @Action('backFromReferalList')
  async backFromReferalList(@Ctx() ctx: MyContext) {
    await ctx.editMessageText(chooseDepartment[ctx.session.lang] as string, {
      reply_markup: referalMenu[ctx.session.lang],
    });
  }
}
