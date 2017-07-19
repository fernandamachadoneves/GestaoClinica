import { Medicanto } from './../models/medicamento';
import { Paciente } from './../models/paciente';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class MedicamentoService {

  private urlRecuperarMedicamento = environment.context + '/GestaoClinica-web/rest/medicamento/';
  private urlRecuperarMedicamentoPorId = environment.context + '/GestaoClinica-web/rest/medicamento/:id';
  private urlEditarMedicamento = environment.context + '/GestaoClinica-web/rest/medicamento/editar';
  private urlExcluirMedicamento = environment.context + '/GestaoClinica-web/rest/medicamento/excluir';
  private urlRecuperarMedicamentoPorNomeGenerico = environment.context + '/GestaoClinica-web/rest/medicamento/pesquisar/:nomeGenerico';

  constructor(private http: Http) { }

  getMedicamentos() {
    debugger;
    let headers = new Headers();
    return this.http.get(this.urlRecuperarMedicamento)
                    .map(this.extractData);
  }

  recuperarMedicamentos(): Promise<any> {
    debugger;
    let url = this.urlRecuperarMedicamento;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  recuperarMedicamentoPorId(id: number){
    let headers = new Headers();
    let url = this.urlRecuperarMedicamentoPorId.replace(':id', id.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  recuperarMedicamentoPorNomeGenerico(nomeGenerico: string){
    let headers = new Headers();
    let url = this.urlRecuperarMedicamentoPorNomeGenerico.replace(':nomeGenerico', nomeGenerico.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  add(medicamento: Medicanto){
    let jsonPost = { "medicamento": JSON.stringify(medicamento)
    }
    medicamento.ativo = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlRecuperarMedicamento, jsonPost,
      options).map((res: Response) => res);
  }

  update(medicamento: Medicanto, idMedicamento: number){
    
    medicamento.id = idMedicamento;
    medicamento.ativo = true;
    let jsonPost = { "medicamento": JSON.stringify(medicamento)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlEditarMedicamento, jsonPost,
      options).map((res: Response) => res);
  }

  remover(medicamento: Medicanto, idMedicamento: number){
    medicamento.id = idMedicamento;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlExcluirMedicamento, JSON.stringify(medicamento),
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
