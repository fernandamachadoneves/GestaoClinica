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

  constructor(private http: Http) { }

  marcarHorario(paciente: Paciente, profissional: Profissional, data: Date, horario: string) {
    debugger

    let marcacaoConsulta = new MarcacaoConsulta();
    marcacaoConsulta.dataAgendamento = new Date();
    marcacaoConsulta.dataConsulta = data;
    marcacaoConsulta.horario = horario;
    marcacaoConsulta.marcado = true;
    marcacaoConsulta.paciente = paciente;
    marcacaoConsulta.profissional = profissional;

    this.marcar(marcacaoConsulta);
  }

  marcar(consulta: MarcacaoConsulta){
    debugger
    let jsonPost = { "consulta": JSON.stringify(consulta)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlMarcarConsulta, jsonPost,
      options).map((res: Response) => res);
  }

  private extractData(res: Response) {
    let body = res.json();

    return body;
  }

  private handleError (error: Response | any) {
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
