import { Profissional } from './models/profissional';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProfissionalService {

  private urlRecuperarProfissional =  'http://localhost:8080/GestaoClinica-web/rest/profissional/';

  profissionais = new Array<Profissional>();

  constructor(private http: Http) { }

  getProfissionais() {
    debugger
    let headers = new Headers();
    return this.http.get(this.urlRecuperarProfissional)
                    .map(this.extractData);
  }

   private extractData(res: Response) {
    let body = res.json();
    return body || { };
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
  

  recuperarProfissionalPorId(id: number){
    let profissional = new Profissional();
    profissional.email = 'profissional@email.com';
    profissional.id  = 1;
    profissional.nome = "José da Silva";
    profissional.telefone = "(31) 33322344";
    profissional.crm = "12345"

    return profissional;
  }

  add(record){
  }

  update(record){
  }

}
