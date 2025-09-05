import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScraperService } from './scraper/scraper.service';
import { BotService } from './bot/bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { FormatterService } from './formatter/formatter.service';
import 'dotenv/config';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_KEY!,
    }),
  ],
  controllers: [AppController],
  providers: [ScraperService, BotService, FormatterService],
})
export class AppModule {}
