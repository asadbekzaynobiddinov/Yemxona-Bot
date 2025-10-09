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
import { referalCreated } from 'src/common/constants';
import { User } from 'src/common/database/schemas/user.schema';

@UseGuards(AdminGuard)
@Update()
export class AdminActions {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectModel(Referal.name) private referalModel: Model<Referal>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  @Action('create_referal')
  async createReferal(@Ctx() ctx: MyContext) {
    let user: User | undefined | null = await this.cache.get(
      `user-${ctx.from?.id}`,
    );
    if (!user) {
      user = await this.userModel.findOne({ telegramId: ctx.from?.id });
      if (!user) return;
    }
    const code = Array.from({ length: 10 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
        Math.floor(Math.random() * 62),
      ),
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
}
