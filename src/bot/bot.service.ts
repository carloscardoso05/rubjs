import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { FormatterService } from 'src/formatter/formatter.service';
import { ScraperService } from 'src/scraper/scraper.service';
import { Context } from 'telegraf';

@Injectable()
@Update()
export class BotService {
  constructor(
    private readonly scraper: ScraperService,
    private readonly formatter: FormatterService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('Olá');
  }

  @Hears('/hoje')
  async onHoje(@Ctx() ctx: Context) {
    const cardapio = await this.scraper.getCardapioDeHoje();
    await ctx.reply(this.formatter.formatarCardapioDoDia(cardapio), {
      parse_mode: 'Markdown',
    });
  }

  @Hears('/semana')
  async onSemana(@Ctx() ctx: Context) {
    const cardapios = await this.scraper.getCardapioDaSemana();
    for (const cardapio of Object.values(cardapios)) {
      await ctx.reply(this.formatter.formatarCardapioDoDia(cardapio, true), {
        parse_mode: 'Markdown',
      });
    }
  }
}
