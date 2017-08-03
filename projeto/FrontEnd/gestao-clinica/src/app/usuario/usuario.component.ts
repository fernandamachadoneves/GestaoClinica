import { UsuarioService } from './../shared/service/usuario.service';
import { Usuario } from './../shared/models/usuario';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: Array<Usuario>;

  constructor(private _usuarioService: UsuarioService) { }

  ngOnInit() {
    this._usuarioService.getUsuarios().subscribe(
      result => {
        this.usuarios = result;
      }
    );
  }

  deletarUsuario(usuario: Usuario){
    this._usuarioService.remover(usuario).subscribe(
      result => {
        this._usuarioService.getUsuarios().subscribe(
          result => {
          this.usuarios = result;
        });
      }
    );
  }

}
