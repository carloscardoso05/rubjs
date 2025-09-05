export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';

export const dias: DiaSemana[] = [
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
] as const;

export function getDiaSemana(dia: Date): DiaSemana {
  return dias[dia.getDay() - 1];
}
