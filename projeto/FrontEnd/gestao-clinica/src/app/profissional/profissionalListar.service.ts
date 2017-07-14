import { Profissional } from './../shared/models/profissional';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ProfissionalListarService {

  static incluiuProfissional = new EventEmitter<boolean>();

  constructor() { }

  incluirProfissional(cadastrouNovo: boolean) {
    debugger
    ProfissionalListarService.incluiuProfissional.emit(cadastrouNovo);
  }
}
