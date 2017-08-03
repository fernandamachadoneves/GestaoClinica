import { Perfil } from './../models/perfil';
import { Usuario } from './../models/usuario';
import { Medicamento} from './../models/medicamento';
import { Paciente } from './../models/paciente';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class UsuarioService {

  private urlRecuperarUsuarios = environment.context + '/GestaoClinica-web/rest/usuario/';
  private urlCadastrarUsuario = environment.context + '/GestaoClinica-web/rest/usuario/cadastrar';
  private urlRecuperarUsuarioPorId = environment.context + '/GestaoClinica-web/rest/usuario/:id';
  private urlEditarUsuario = environment.context + '/GestaoClinica-web/rest/usuario/editar';
  private urlExcluirUsuario = environment.context + '/GestaoClinica-web/rest/usuario/excluir';
  private urlrecuperarUsuarioPorEmailSenha= environment.context + '/GestaoClinica-web/rest/usuario/recuperarUsuarioPorEmailSenha';
  private urlRecuperarUsuarioPorLogin = environment.context + '/GestaoClinica-web/rest/usuario/recuperarUsuarioPorLogin/:login';

  constructor(private http: Http) { }

  getUsuarios() {
    debugger;
    let headers = new Headers();
    return this.http.get(this.urlRecuperarUsuarios)
                    .map(this.extractData);
  }

  recuperarUsuarioPorId(id: number){
    let headers = new Headers();
    let url = this.urlRecuperarUsuarioPorId.replace(':id', id.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  recuperarUsuarioPorLogin(login: string) : Promise<any>{
    debugger
    let headers = new Headers();
    let url = this.urlRecuperarUsuarioPorLogin.replace(':login', login.toString());
     return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  recuperarUsuarioPorEmailSenha(login: string, senha: string){
    let jsonPost = { "login": JSON.stringify(login),
                     "senha": JSON.stringify(senha)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlrecuperarUsuarioPorEmailSenha, jsonPost,
      options).map(this.extractData);
  }

  add(usuario: Usuario){
    let jsonPost = { "usuario": JSON.stringify(usuario)
    }
    usuario.ativo = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlCadastrarUsuario, jsonPost,
      options).map((res: Response) => res);
  }

  update(usuario: Usuario, idUsuario: number){
    usuario.id = idUsuario;
    usuario.ativo = true;
    let jsonPost = { "usuario": JSON.stringify(usuario)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlEditarUsuario, jsonPost,
      options).map((res: Response) => res);
  }

  remover(usuario: Usuario){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlExcluirUsuario, JSON.stringify(usuario),
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
