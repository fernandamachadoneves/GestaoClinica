import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class PacienteListarService {

  static incluiuPaciente = new EventEmitter<boolean>();

  constructor() { }

  incluirPaciente(cadastrouNovo: boolean) {
    PacienteListarService.incluiuPaciente.emit(cadastrouNovo);
  }

}
