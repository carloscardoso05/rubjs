import { Controller, Get, Logger } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';

@Controller()
export class AppController {
  constructor(private readonly scraper: ScraperService) {}

  private readonly logger = new Logger(AppController.name);

  @Get('/cardapio/hoje')
  getCardapioDeHoje() {
    return this.scraper.getCardapioDeHoje();
  }

  @Get('/cardapio/semana')
  getCardapioDaSemana() {
    return this.scraper.getCardapioDaSemana();
  }
}
