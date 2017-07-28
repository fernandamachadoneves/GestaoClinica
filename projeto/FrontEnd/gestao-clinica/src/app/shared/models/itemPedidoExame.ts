import { TipoResultadoExame } from './tipoResultadoExame';
import { Exame } from './exame';
import { PedidoExame } from './PedidoExame';
import { Medicamento } from './medicamento';
import { Receita } from './receita';
import { TipoDosagem } from './tipoDosagem';
import { Paciente } from './paciente';
import { Profissional } from './profissional';

export class ItemPedidoExame {
  id: number;
  pedidoExame: PedidoExame;
  exame: Exame;
  ativo: boolean;
  justificativa: string;
  resultadoObs: string;
  dataRealizacao: Date;
  tipoResultado: TipoResultadoExame;
  selecionado: boolean;
}
