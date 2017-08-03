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

  form: FormGroup;
  title: string;
  usuario: Usuario = new Usuario();
  perfilOptions = Array<Perfil>();
  descBotao;
  selecionouPerfil: boolean = false;
  profCadastrados = Array<Profissional>();
  perfilMedico: boolean = false;
  profissional: Profissional;

  constructor(formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private enumService: EnumService,
    private profissionalService: ProfissionalService) { 

   this.form = formBuilder.group({
      login: ['', [
        //Validators.required,
        //Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      perfil: [],
      senha: ['', [
        Validators.required,
        Validators.minLength(3)
      ]]
    });
 }

  ngOnInit() {
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
        .subscribe(
          user => {
            this.usuario = user
      });
    });
  }

  selecionarPerfil(event){
    debugger
    this.selecionouPerfil = true;
    if (this.usuario.perfil.descricao == 'MEDICO'){
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

  save() {
    debugger
    this.usuarioService.recuperarUsuarioPorLogin(this.usuario.login).then(
      result =>{
        if (result){
          Materialize.toast('Email já cadastrado', 4000, "");
          
        } else {
            var result,
            usuarioValor = this.form.value;

            if (this.usuario.id){
              result = this.usuarioService.update(usuarioValor, this.usuario.id);
            } else {
              result = this.usuarioService.add(usuarioValor);
            }

            result.subscribe(data => this.router.navigate(['usuario']));
        }
      });
  }

  onCancel(){
    this.router.navigate(['/usuario']);
  }

}
