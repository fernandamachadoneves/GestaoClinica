import { Perfil } from './shared/models/perfil';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  mostrarMenu: boolean = false;
  perfil: Perfil;

  constructor(private _autService: AuthService,
              private _router: Router){

  }

  ngOnInit(){
    this.perfil = new Perfil();
    this._autService.mostrarMenuEmitter.subscribe(
      mostrar =>  this.mostrarMenu = mostrar
    );
    this._autService.verificarPerfilUsuario.subscribe(
      result => {
        this.perfil = result;
      }
    )
  }

  onLogout(){
    this._autService.mostrarMenuEmitter.emit(false);
     this._router.navigate(['/login']);
  }
}
