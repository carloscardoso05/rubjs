import { Injectable } from '@nestjs/common';
import { Cardapio, Refeicao } from 'src/models/cardapio';
import { getDiaSemana } from 'src/models/dia_semana';

@Injectable()
export class FormatterService {
  public formatarCardapioDoDia(cardapio: Cardapio, compacto = false): string {
    const diaSemana = getDiaSemana(cardapio.dia).toUpperCase();
    const dataFormatada = cardapio.dia.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
    const almoco = this.formatarRefeicao(cardapio.almoco, compacto);
    const janta = this.formatarRefeicao(cardapio.janta, compacto);

    return `
📅 *${diaSemana} (${dataFormatada})* 📅
-------------------------------------------------------
☀️ *ALMOÇO*
${almoco}

🌙 *JANTA*
${janta}
`;
  }

  private capitalize(text: string): string {
    return text.at(0)?.toUpperCase() + text.slice(1).toLowerCase();
  }

  private formatarRefeicao(refeicao: Refeicao, compacto = false): string {
    const acompanhamentos = refeicao.acompanhamentos
      .map((item) => `  - ${this.capitalize(item.trim())}`)
      .join('\n');

    let str =
      ` - 🍖 *Principal:* ${this.capitalize(refeicao.principal.trim())}\n` +
      ` - 🥗 *Vegetariano:* ${this.capitalize(refeicao.vegetariano.trim())}`;

    if (!compacto) {
      str += `\n - 🍚 *Acompanhamentos:*\n${acompanhamentos}`;
    }

    return str;
  }
}
