import { Exame } from './exame';
import { PedidoExame } from './PedidoExame';
import { Medicamento } from './medicamento';
import { Receita } from './receita';
import { TipoDosagem } from './tipoDosagem';
import { Paciente } from './paciente';
import { Profissional } from './profissional';

export class ItemReceita {
  id: number;
  pedidoExame: PedidoExame;
  exame: Exame;
  resultado: string;
}
