import { Perfil } from './perfil';
export class Usuario {
  id: number;
  login: string;
  senha: string;
  ativo: boolean;
  perfil: Perfil;
}
