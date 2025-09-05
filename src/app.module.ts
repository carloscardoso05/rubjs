import { Module } from '@nestjs/common';
import 'dotenv/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import rateLimit from 'telegraf-ratelimit';
import { AppController } from './app.controller';
import { BotService } from './bot/bot.service';
import { FormatterService } from './formatter/formatter.service';
import { ScraperService } from './scraper/scraper.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_KEY!,
      middlewares: [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        rateLimit({
          window: 10000,
          limit: 3,
          onLimitExceeded: (ctx: Context) =>
            ctx.reply('Espere um pouco, por favor.'),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [ScraperService, BotService, FormatterService],
})
export class AppModule {}
