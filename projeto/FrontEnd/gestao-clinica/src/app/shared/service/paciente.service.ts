import { Paciente } from './../models/paciente';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class PacienteService {

  private urlRecuperarPaciente = environment.context + '/GestaoClinica-web/rest/paciente/';
  private urlRecuperarPacientePorId = environment.context + '/GestaoClinica-web/rest/paciente/:id';
  private urlEditarPaciente = environment.context + '/GestaoClinica-web/rest/paciente/editar';
  private urlExcluirPaciente = environment.context + '/GestaoClinica-web/rest/paciente/excluir';
  private urlRecuperarPacientePorNome = environment.context + '/GestaoClinica-web/rest/paciente/pesquisar/:nome';

  constructor(private http: Http) { }

  getPacientes() {
    debugger;
    let headers = new Headers();
    return this.http.get(this.urlRecuperarPaciente)
                    .map(this.extractData);
  }

  recuperarPacientes(): Promise<any> {
    debugger;
    let url = this.urlRecuperarPaciente;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  recuperarPacientePorId(id: number){
    let headers = new Headers();
    let url = this.urlRecuperarPacientePorId.replace(':id', id.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  recuperarPacientePorNome(nome: string){
    let headers = new Headers();
    let url = this.urlRecuperarPacientePorNome.replace(':nome', nome.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  add(paciente: Paciente){
    let jsonPost = { "paciente": JSON.stringify(paciente)
    }
    paciente.ativo = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlRecuperarPaciente, jsonPost,
      options).map((res: Response) => res);
  }

  update(paciente: Paciente, idPaciente: number){
    
    paciente.id = idPaciente;
    paciente.ativo = true;
    let jsonPost = { "paciente": JSON.stringify(paciente)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlEditarPaciente, jsonPost,
      options).map((res: Response) => res);
  }

  remover(paciente: Paciente, idPaciente: number){
    paciente.id = idPaciente;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlExcluirPaciente, JSON.stringify(paciente),
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
