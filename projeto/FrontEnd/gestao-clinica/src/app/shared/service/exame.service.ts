import { Medicamento} from './../models/medicamento';
import { Paciente } from './../models/paciente';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class ExameService {

  private urlRecuperarExames = environment.context + '/GestaoClinica-web/rest/exame/';
  private urlRecuperarExamePorNome = environment.context + '/GestaoClinica-web/rest/exame/pesquisar/:nome';

  constructor(private http: Http) { }

  recuperarExames(): Promise<any> {
    debugger;
    let url = this.urlRecuperarExames;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  recuperarExamePorNome(nome: string){
    let headers = new Headers();
    let url = this.urlRecuperarExamePorNome.replace(':nome', nome.toString());
    return this.http.get(url)
                    .map(this.extractData);
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
