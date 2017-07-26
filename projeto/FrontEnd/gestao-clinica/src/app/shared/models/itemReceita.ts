import { Medicamento } from './medicamento';
import { Receita } from './receita';
import { TipoDosagem } from './tipoDosagem';
import { Paciente } from './paciente';
import { Profissional } from './profissional';

export class ItemReceita {
  id: number;
  receita: Receita;
  medicamento: Medicamento;
  descricao: string;
  ativo: boolean;
}
