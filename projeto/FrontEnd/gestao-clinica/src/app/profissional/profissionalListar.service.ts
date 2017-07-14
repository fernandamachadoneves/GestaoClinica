import { Profissional } from './../shared/models/profissional';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ProfissionalListarService {

  static incluiuProfissional = new EventEmitter<boolean>();

  constructor() { }

  incluirProfissional(cadastrouNovo: boolean) {
    ProfissionalListarService.incluiuProfissional.emit(cadastrouNovo);
  }
}
