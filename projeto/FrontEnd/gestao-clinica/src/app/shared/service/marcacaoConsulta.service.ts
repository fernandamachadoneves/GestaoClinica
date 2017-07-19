import { Profissional } from './../models/profissional';
import { MarcacaoConsulta } from './../models/marcacaoConsulta';
import { Paciente } from './../models/paciente';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class MarcacaoConsultaService {

  private urlMarcarConsulta = environment.context + '/GestaoClinica-web/rest/marcacaoConsulta/';
  private urlPesquisarMarcacoes = environment.context + '/GestaoClinica-web/rest/marcacaoConsulta/pesquisarMarcacoes';

  constructor(private http: Http) { }

  marcar(consulta: MarcacaoConsulta, paciente: Paciente, profissional: Profissional) {
    let jsonPost = { "consulta": JSON.stringify(consulta),
            "profissional": JSON.stringify(profissional),
            "paciente": JSON.stringify(paciente)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlMarcarConsulta, jsonPost,
      options).map((res: Response) => res);
  }

  pesquisarMarcacoes(profissional: Profissional, data: Date){

    let jsonPost = { "profissional": JSON.stringify(profissional),
                     "data": JSON.stringify(data)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.urlPesquisarMarcacoes, jsonPost,
      options).map(this.extractData);
  }

  private extractData(res: Response) {
    let body = res.json();

    return body;
  }

  private handleError (error: Response | any) {
    debugger
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
