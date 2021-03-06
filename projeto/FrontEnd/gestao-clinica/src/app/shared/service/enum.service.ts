import { Paciente } from './../models/paciente';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class EnumService {

  private urlEnums: string = environment.domain + '/GestaoClinica-web/rest/enums/TipoResultadoExame';
  private urlEnumsPerfil: string = environment.domain + '/GestaoClinica-web/rest/enums/Perfil';
  private urlRecuperarTipoResultadoPorType: string = environment.domain + '/GestaoClinica-web/rest/enums/TipoResultadoPorType/:type';
  private urlRecuperarPerfilPorType: string = environment.domain + '/GestaoClinica-web/rest/enums/PerfilPorType/:type';

  constructor(private http: Http) { }

  getEnum(name: string): Observable<any> {
    debugger
    let url = this.urlEnums;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options).map(this.extractData);
  }

  recuperarPerfis(): Observable<any> {
    debugger
    let url = this.urlEnumsPerfil;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options).map(this.extractData);
  }

  recuperarTipoResultadoPorType(type: string): Promise<any>{
    let headers = new Headers();
    let url = this.urlRecuperarTipoResultadoPorType.replace(':type', type.toString());
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  recuperarPerfilPorType(type: string): Promise<any>{
    let headers = new Headers();
    let url = this.urlRecuperarPerfilPorType.replace(':type', type.toString());
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
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
