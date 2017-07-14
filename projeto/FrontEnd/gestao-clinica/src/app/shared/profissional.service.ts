import { ConfiguracaoHorarioProfissional } from './models/configuracaoHorarioProfissional';
import { environment } from './../../environments/environment.prod';
import { Profissional } from './models/profissional';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class ProfissionalService {

  private urlRecuperarProfissional = environment.context + '/GestaoClinica-web/rest/profissional/';
  private urlRecuperarProfissionalPorId = environment.context + '/GestaoClinica-web/rest/profissional/:id';
  private urlEditarProfissional = environment.context + '/GestaoClinica-web/rest/profissional/editar';
  private urlExcluirProfissional = environment.context + '/GestaoClinica-web/rest/profissional/excluir';
  private urlRecuperarProfissionalPorNome = environment.context + '/GestaoClinica-web/rest/profissional/pesquisar/:nome';
  private urlRecuperarConfigProfPorId = environment.context + '/GestaoClinica-web/rest/profissional/pesquisarConfiguracao/:idProfissional';

  profissionais = new Array<Profissional>();

  constructor(private http: Http) { }

  getProfissionais() {
    debugger;
    let headers = new Headers();
    return this.http.get(this.urlRecuperarProfissional)
                    .map(this.extractData);
  }

  recuperarProfissionais(): Promise<any> {
    debugger;
    let url = this.urlRecuperarProfissional;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  recuperarProfissionalPorId(id: number){
    let headers = new Headers();
    let url = this.urlRecuperarProfissionalPorId.replace(':id', id.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  recuperarProfissionalPorNome(nome: string){
    let headers = new Headers();
    let url = this.urlRecuperarProfissionalPorNome.replace(':nome', nome.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  add(profissional: Profissional, configProf: ConfiguracaoHorarioProfissional, diasDaSemana: string){
    configProf.diasDaSemana = diasDaSemana;
    let jsonPost = { "profissional": JSON.stringify(profissional),
                     "configProf": JSON.stringify(configProf)
    }
    profissional.ativo = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlRecuperarProfissional, jsonPost,
      options).map((res: Response) => res);
  }

  update(profissional: Profissional, idProfissional: number, configProf: ConfiguracaoHorarioProfissional, idConfig: number, diasDaSemana: string){
    
    profissional.id = idProfissional;
    profissional.ativo = true;
    configProf.id = idConfig;
    configProf.diasDaSemana = diasDaSemana;
    let jsonPost = { "profissional": JSON.stringify(profissional),
                     "configProf": JSON.stringify(configProf)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlEditarProfissional, jsonPost,
      options).map((res: Response) => res);
  }

  remover(profissional: Profissional, idProfissional: number){
    profissional.id = idProfissional;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlExcluirProfissional, JSON.stringify(profissional),
      options).map((res: Response) => res);
  }

  recuperarConfigProfissionalPorId(idProfissional: number){
    let headers = new Headers();
    let url = this.urlRecuperarConfigProfPorId.replace(':idProfissional', idProfissional.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  recuperarConfigProfissional(idProfissional: number): Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let url = this.urlRecuperarConfigProfPorId.replace(':idProfissional', idProfissional.toString());

    return this.http.get(url, options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
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
