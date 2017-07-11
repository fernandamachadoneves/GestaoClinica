import { environment } from './../../environments/environment.prod';
import { Profissional } from './models/profissional';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ProfissionalService {

  private urlRecuperarProfissional = environment.context + '/GestaoClinica-web/rest/profissional/';
  private urlRecuperarProfissionalPorId = environment.context + '/GestaoClinica-web/rest/profissional/:id';

  profissionais = new Array<Profissional>();

  constructor(private http: Http) { }

  getProfissionais() {
    debugger;
    let headers = new Headers();
    return this.http.get(this.urlRecuperarProfissional)
                    .map(this.extractData);
  }


  recuperarProfissionalPorId(id: number){
    let headers = new Headers();
    let url = this.urlRecuperarProfissionalPorId.replace(':id', id.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  add(profissional: Profissional){
    debugger
    return this.http.post(this.urlRecuperarProfissional, JSON.stringify(profissional), {headers: this.getHeaders()})
                    .map(this.extractData);
  }

  update(record){
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private getHeaders(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
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
