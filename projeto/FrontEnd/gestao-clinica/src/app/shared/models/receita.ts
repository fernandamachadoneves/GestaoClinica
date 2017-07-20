import { TipoDosagem } from './tipoDosagem';
import { Paciente } from './paciente';
import { Profissional } from './profissional';

export class Receita {
  id: number;
  dataReceita: Date;
  paciente: Paciente;
  profissional: Profissional;
  ativo: boolean;
  tipoDosagem: TipoDosagem;
  quantidade: number;
}
