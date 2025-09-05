export interface Cardapio {
  dia: Date;
  almoco: Refeicao;
  janta: Refeicao;
}

export interface Refeicao {
  acompanhamentos: string[];
  principal: string;
  vegetariano: string;
}
