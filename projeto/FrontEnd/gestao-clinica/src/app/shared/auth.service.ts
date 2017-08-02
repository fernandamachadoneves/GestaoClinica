import { Router } from '@angular/router';
import { Usuario } from './models/usuario';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AuthService {

  private usuarioAutenticado: boolean = false;

  mostrarMenuEmitter = new EventEmitter<boolean>();

  constructor(private _router: Router) { }

  fazerLogin(usuario: Usuario){

    if (usuario.login == 'teste@gmail.com' && usuario.senha == '123123'){
      this.usuarioAutenticado = true;
      this.mostrarMenuEmitter.emit(true);
      this._router.navigate(['/']);
    } else {
      this.usuarioAutenticado = false;
      this.mostrarMenuEmitter.emit(false);
    }

  }

  usuarioEstaAutenticado(){
    return this.usuarioAutenticado;
  }

}
