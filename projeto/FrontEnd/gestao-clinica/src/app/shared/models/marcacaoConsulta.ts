import { Paciente } from './paciente';
import { Profissional } from './profissional';

export class MarcacaoConsulta {
  id: number;
  horario: string;
  dataConsulta: Date;
  dataAgendamento: Date;
  paciente: Paciente;
  profissional: Profissional;
  marcado: boolean;
}
