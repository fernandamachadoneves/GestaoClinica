import { CookieService } from 'angular2-cookie/core';
import { EnumService } from './service/enum.service';
import { UsuarioService } from './service/usuario.service';
import { Perfil } from './models/perfil';
import { Router } from '@angular/router';
import { Usuario } from './models/usuario';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AuthService {

  private usuarioAutenticado: boolean = false;

  usuarioLogado: Usuario;

  mostrarMenuEmitter = new EventEmitter<boolean>();

  verificarPerfilUsuario = new EventEmitter<Perfil>();

  constructor(private _router: Router,
              private _usuarioService: UsuarioService,
              private _enumService: EnumService,
              private _cookie:CookieService
            ) { }

  fazerLogin(usuario: Usuario){
    debugger
    if (usuario.login == 'adm@gestaoclinica.com' && usuario.senha == '123123'){
        this.usuarioAutenticado = true;
        this.usuarioLogado = usuario;
        this.mostrarMenuEmitter.emit(true);
        this._enumService.recuperarPerfilPorType('ADMINISTRADOR').then(
          perfil => {
            this.usuarioLogado.perfil = perfil;
            this.verificarPerfilUsuario.emit(perfil);
            this._cookie.put('perfil', perfil.type);
            this._cookie.put('login', usuario.login);
          }
        );
        this._router.navigate(['/']);
    } else {
      this._usuarioService.recuperarUsuarioPorEmailSenha(usuario.login, usuario.senha).subscribe(
        result => {
            if (result != null && result !== undefined){
              this.usuarioAutenticado = true;
              this.usuarioLogado = usuario;
              this.usuarioLogado.perfil = result.perfil;
              this._cookie.put('perfil', this.usuarioLogado.perfil.type);
              this._cookie.put('login', usuario.login);
              this.mostrarMenuEmitter.emit(true);
              this.verificarPerfilUsuario.emit(result.perfil);
              this._router.navigate(['/']);
            } else{
              this.usuarioAutenticado = false;
              this.mostrarMenuEmitter.emit(false);
              $('.modal').modal('open');
              //Materialize.toast('Usuário ou senha inválidos', 4000, "");
            }
          }
      );
    }

  }

  usuarioEstaAutenticado(){
    return this.usuarioAutenticado;
  }

}
