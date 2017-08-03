import { Perfil } from './../../shared/models/perfil';
import { EnumService } from './../../shared/service/enum.service';
import { UsuarioService } from './../../shared/service/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from './../../shared/models/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css']
})
export class UsuarioDetailComponent implements OnInit {

  form: FormGroup;
  title: string;
  usuario: Usuario = new Usuario();
  perfilOptions = Array<Perfil>();
  descBotao;

  constructor(formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private enumService: EnumService) { 

    this.form = formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      perfil: [],
      senha: ['', [
        Validators.required,
        Validators.minLength(3)
      ]]
    });  

 }

  ngOnInit() {
    $('select').material_select();
    this.enumService.recuperarPerfis().subscribe(tipos => this.perfilOptions = tipos);
    var id = this.route.params.subscribe(params => {
    var id = params['id'];

      this.title = id ? 'Editar Usuário' : 'Cadastrar Usuário';
      this.descBotao = id ? 'Editar' : 'Cadastrar';

      if (!id)
        return;

      this.usuarioService.recuperarUsuarioPorId(id)
        .subscribe(
          user => {
            this.usuario = user
      });
    });
  }

  save() {
    debugger
      var result,
      usuarioValor = this.form.value;

      if (this.usuario.id){
        result = this.usuarioService.update(usuarioValor, this.usuario.id);
      } else {
        result = this.usuarioService.add(usuarioValor);
      }

      result.subscribe(data => this.router.navigate(['usuario']));
  }

  onCancel(){
    this.router.navigate(['/usuario']);
  }

}
