import { ItemReceita } from './../models/itemReceita';
import { environment } from './../../../environments/environment';
import { Headers, RequestOptions, Response, Http } from '@angular/http';
import { Receita } from './../models/receita';
import { Profissional } from './../models/profissional';
import { Paciente } from './../models/paciente';
import { ConfiguracaoHorarioProfissional } from './../models/configuracaoHorarioProfissional';
import { ProfissionalService } from './../profissional.service';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReceitaService {

  private urlAdicionarReceita = environment.context + '/GestaoClinica-web/rest/receita/adicionar';
  private urlPesquisarReceitas = environment.context + '/GestaoClinica-web/rest/receita/pesquisarReceitas/:idPaciente';

  constructor(private http: Http) { }

  addReceita(idPaciente: number, idProfissional: number, itensReceita: Array<ItemReceita>) {
    debugger
    let jsonPost = { "idPaciente": JSON.stringify(idPaciente),
            "idProfissional": JSON.stringify(idProfissional),
            "itensReceita": JSON.stringify(itensReceita)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlAdicionarReceita, jsonPost,
      options).map((res: Response) => res);
  }

  recuperarReceitaPorPaciente(idPaciente: number){
    let headers = new Headers();
    let url = this.urlPesquisarReceitas.replace(':idPaciente', idPaciente.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

    private extractData(res: Response) {
    let body = res.json();

    return body;
  }

}
