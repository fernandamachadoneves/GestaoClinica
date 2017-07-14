import { ConfiguracaoHorarioProfissional } from './../models/configuracaoHorarioProfissional';
import { ProfissionalService } from './../profissional.service';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConfiguracaoHorarioProfissionalService {

  constructor(private _profissionalService: ProfissionalService) { }

}
