import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Element } from 'node_modules/domhandler/lib/node';
import { Cardapio, Refeicao } from 'src/models/cardapio';
import { DiaSemana, getDiaSemana } from 'src/models/dia_semana';

@Injectable()
export class ScraperService {
  private readonly cardapioUrl =
    'https://saest.ufpa.br/ru/index.php/component/cardapio/';
  private readonly logger = new Logger(ScraperService.name);

  async getCardapioDaSemana(): Promise<Record<DiaSemana, Cardapio>> {
    const html = await cheerio.fromURL(this.cardapioUrl);
    const tbody = html('#content-section > div > table > tbody:nth-child(1)');
    const rows = tbody.children('tr');
    const cardapios: Cardapio[] = rows
      .toArray()
      .slice(1)
      .map((row) => ({
        dia: this.extractDia(html(row)),
        almoco: this.extractRefeicao(html(row).children('td').eq(1)),
        janta: this.extractRefeicao(html(row).children('td').eq(2)),
      }));
    return cardapios.reduce(
      (acc, cardapio) => {
        const diaSemana = getDiaSemana(cardapio.dia);
        acc[diaSemana] = cardapio;
        return acc;
      },
      {} as Record<DiaSemana, Cardapio>,
    );
  }

  async getCardapioDeHoje(): Promise<Cardapio> {
    return (await this.getCardapioDaSemana())[getDiaSemana(new Date())];
  }

  private extractRefeicao(td: cheerio.Cheerio<Element>): Refeicao {
    return {
      principal: this.extractPrincipal(td.text()),
      vegetariano: this.extractVegetariano(td.text()),
      acompanhamentos: this.extractAcompanhamentos(td),
    };
  }

  private extractDia(row: cheerio.Cheerio<Element>): Date {
    const dataColText = row.children('td').eq(0).text();
    const data = dataColText.match(/\d{2}\/\d{2}/)?.at(0);
    if (!data) {
      const error = new Error('Não foi possível extrair a data');
      this.logger.error(error);
      throw error;
    }
    const dia = parseInt(data.substring(0, 2));
    const mes = parseInt(data.substring(3, 5)) - 1;
    const ano = new Date().getFullYear();
    const date = new Date(ano, mes, dia);
    return date;
  }

  private extractPrincipal(tdText: string): string {
    const principal = tdText.split(/[\n\t]+/).at(1);
    if (!principal) {
      const error = new Error('Não foi possível extrair o prato principal');
      this.logger.error(error);
      throw error;
    }
    return principal;
  }

  private extractVegetariano(tdText: string): string {
    const vegetarianoLength = 'VEGETARIANO: '.length;
    const vegetariano = tdText
      .split(/[\n\t]+/)
      .at(2)
      ?.slice(vegetarianoLength);
    if (!vegetariano) {
      const error = new Error('Não foi possível extrair o prato vegetariano');
      this.logger.error(error);
      throw error;
    }
    return vegetariano;
  }

  private extractAcompanhamentos(td: cheerio.Cheerio<Element>): string[] {
    const acompanhamentos = td
      .find('ul')
      .children('li')
      .map((_, li) => cheerio.load(li).text().replaceAll(';', ''))
      .toArray();
    if (!acompanhamentos) {
      const error = new Error('Não foi possível extrair os acompanhamentos');
      this.logger.error(error);
      throw error;
    }
    return acompanhamentos;
  }
}
