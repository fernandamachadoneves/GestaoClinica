import { CookieService } from 'angular2-cookie/core';
import { EnumService } from './service/enum.service';
import { UsuarioService } from './service/usuario.service';
import { Perfil } from './models/perfil';
import { Router } from '@angular/router';
import { Usuario } from './models/usuario';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AuthService {

  mostrarMenuEmitter = new EventEmitter<boolean>();

  constructor(private _router: Router,
              private _usuarioService: UsuarioService,
              private _enumService: EnumService,
              private _cookie:CookieService
            ) { }

  fazerLogin(usuario: Usuario){
    debugger
    if (usuario.login == 'adm@gestaoclinica.com' && usuario.senha == '123123'){
        this._cookie.put('login', usuario.login);
        this._cookie.put('perfil', 'ADMINISTRADOR');
        this.mostrarMenuEmitter.emit(true);
        this._router.navigate(['/']);
    } else {
      this._usuarioService.recuperarUsuarioPorEmailSenha(usuario.login, usuario.senha).subscribe(
        result => {
            if (result != null && result !== undefined){
              this._cookie.put('perfil', result.perfil.type);
              this._cookie.put('login', usuario.login);
              this.mostrarMenuEmitter.emit(true);
              this._router.navigate(['/']);
            } else{
              this._cookie.removeAll();
              this.mostrarMenuEmitter.emit(false);
              $('.modal').modal('open');
              //Materialize.toast('Usuário ou senha inválidos', 4000, "");
            }
          }
      );
    }

  }

  usuarioEstaAutenticado(){
    if (this._cookie.get('login')){
      return true;
    } else {
      return false;
    }
  }

}
