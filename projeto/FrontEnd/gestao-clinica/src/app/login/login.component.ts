import { Usuario } from './../shared/models/usuario';
import { AuthService } from './../shared/auth.service';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private LOGO = require("./img/teste.jpg");

  private usuario: Usuario = new Usuario();

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  fazerLogin(){
    this._authService.fazerLogin(this.usuario);
  }

}
