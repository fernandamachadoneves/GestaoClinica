import { ProfissionalService } from './../../shared/profissional.service';
import { Profissional } from './../../shared/models/profissional';
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

  title: string;
  usuario: Usuario = new Usuario();
  perfilOptions = Array<Perfil>();
  descBotao;
  selecionouPerfil: boolean = false;
  profCadastrados = Array<Profissional>();
  perfilMedico: boolean = false;
  profissional: Profissional;
  perfil: string;

  constructor(formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private enumService: EnumService,
    private profissionalService: ProfissionalService) { 
 }

  ngOnInit() {
    debugger
    this.profissional = new Profissional();
    this.usuario.perfil = new Perfil();
    $('select').material_select();
    this.enumService.recuperarPerfis().subscribe(tipos => this.perfilOptions = tipos);
    var id = this.route.params.subscribe(params => {
    var id = params['id'];

      this.title = id ? 'Editar Usuário' : 'Cadastrar Usuário';
      this.descBotao = id ? 'Editar' : 'Cadastrar';

      if (!id)
        return;
      
      this.usuarioService.recuperarUsuarioPorId(id)
        .then(
          user => {
            this.usuario = user;
            this.perfil = this.usuario.perfil.type;
            this.selecionarPerfil();
            $('select').material_select();
      });
    });
  }

  selecionarPerfil(){
    this.selecionouPerfil = true;
    if (this.perfil == 'MEDICO'){
      this.perfilMedico = true;
      this.profissionalService.recuperarProfissionais().then(
        result => {
          this.profCadastrados = result;
        }
      )
    } else{
      this.perfilMedico = false;
    }
  }

  selecionarEmail(event, profEmail){
    this.usuario.login = profEmail;
  }

  save() {
    if (this.validarCampos()) {
      this.usuarioService.recuperarUsuarioPorLogin(this.usuario.login).then(
        result =>{
          if (result){
            Materialize.toast('Email já cadastrado', 4000, "");
            
          } else {

              if (this.usuario.id){
                result = this.usuarioService.update(this.usuario, this.perfil);
              } else {
                result = this.usuarioService.add(this.usuario, this.perfil);
              }

              result.subscribe(data => this.router.navigate(['usuario']));
          }
        });
    }
  }

  validarCampos(){
    debugger
    let resultado = true;

    if (!this.selecionouPerfil){
      Materialize.toast('É obrigatório informar o perfil do usuário', 4000, "");
      return false;
    }

    if (this.usuario.login == null || this.usuario.login == undefined || this.usuario.login == ''){
      Materialize.toast('É obrigatório informar o login', 4000, "");
      return false;
    }

     if (this.usuario.senha == null || this.usuario.senha == undefined || this.usuario.senha == ''){
      Materialize.toast('É obrigatório informar a senha do usuário', 4000, "");
      return false;
    }

    return resultado;
  }

  onCancel(){
    this.router.navigate(['/usuario']);
  }

}
