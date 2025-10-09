import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const adminMenu: Record<string, InlineKeyboardMarkup> = {
  uz: {
    inline_keyboard: [
      [Markup.button.callback('🔗 Referal yaratish', 'create_referal')],
      [Markup.button.callback("➕ Mahsulot Qo'shish", 'add_product')],
      [Markup.button.callback("📂 Kategoriya Qo'shishish", 'add_category')],
      [Markup.button.callback("📦 Mahsulotlarni Ko'rish", 'view_products')],
      [Markup.button.callback("🗂 Kategoriyalarni Ko'rish", 'view_categories')],
    ],
  },
  kr: {
    inline_keyboard: [
      [Markup.button.callback('🔗 Referal яратиш', 'create_referal')],
      [Markup.button.callback('➕ Махсулот Қўшиш', 'add_product')],
      [Markup.button.callback('📂 Категория Қўшишиш', 'add_category')],
      [Markup.button.callback('📦 Махсулотларни Кўриш', 'view_products')],
      [Markup.button.callback('🗂 Категорияларни Кўриш', 'view_categories')],
    ],
  },
};
