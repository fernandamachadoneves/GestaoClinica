import { CookieService } from 'angular2-cookie/core';
import { Perfil } from './shared/models/perfil';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { Component } from '@angular/core';
import {MaterializeDirective} from 'angular2-materialize';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  mostrarMenu: boolean = false;
  perfil: string;

  constructor(private _autService: AuthService,
              private _router: Router,
              private _cookie: CookieService){

  }

   ngAfterViewInit() {
         $(".dropdown-button").dropdown();
         $('.button-collapse').sideNav();


   }

  ngOnInit(){
    this._autService.mostrarMenuEmitter.subscribe(
      mostrar =>  {
        if (!this.mostrarMenu){
          this.mostrarMenu = mostrar
        }
        this.perfil = this._cookie.get('perfil');
    });
  }


  onLogout(){
   this.mostrarMenu = false;
    this._cookie.removeAll();
    this._router.navigate(['/login']);
  }
}
