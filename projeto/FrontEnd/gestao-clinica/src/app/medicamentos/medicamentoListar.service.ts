import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MedicamentoListarService {

  static incluiuMedicamento = new EventEmitter<boolean>();

  constructor() { }

  incluirMedicamento(cadastrouNovo: boolean) {
    MedicamentoListarService.incluiuMedicamento.emit(cadastrouNovo);
  }

}
