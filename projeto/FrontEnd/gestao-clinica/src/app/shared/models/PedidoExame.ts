import { Medicamento } from './medicamento';
import { Receita } from './receita';
import { TipoDosagem } from './tipoDosagem';
import { Paciente } from './paciente';
import { Profissional } from './profissional';

export class PedidoExame {
  id: number;
  dataPedido: Date;
  paciente: Paciente;
  profissional: Profissional;
  ativo: boolean;
}
