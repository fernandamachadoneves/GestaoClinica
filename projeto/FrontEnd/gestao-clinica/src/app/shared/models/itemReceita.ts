import { Medicamento } from './medicamento';
import { Receita } from './receita';
import { TipoDosagem } from './tipoDosagem';
import { Paciente } from './paciente';
import { Profissional } from './profissional';

export class ItemReceita {
  id: number;
  receita: Receita;
  medicamento: Medicamento;
  tipoDosagem: TipoDosagem;
  quantidade: number;
  dias: number;
  frequencia: string;
}
