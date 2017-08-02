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

  constructor(private _autService: AuthService){

  }

  ngOnInit(){
    this._autService.mostrarMenuEmitter.subscribe(
      mostrar =>  this.mostrarMenu = mostrar
    );
  }
}
