import { UsuarioService } from './../../shared/service/usuario.service';
import { ProfissionalListarService } from './../profissionalListar.service';
import { ConfiguracaoHorarioProfissional } from './../../shared/models/configuracaoHorarioProfissional';
import { ProfissionalService } from './../../shared/profissional.service';
import { Profissional } from './../../shared/models/profissional';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-profissional-cadastro',
  templateUrl: './profissional-cadastro.component.html',
  styleUrls: ['./profissional-cadastro.component.css']
})
export class ProfissionalCadastroComponent implements OnInit {

  public maskHora = [/\d/, /\d/, ':', /\d/, /\d/];
  public maskTelefone = ['(', /[1-9]/, /\d/, ')', ' ',/\d/,/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  form: FormGroup;
  formConfig: FormGroup;
  private idProfissional: number;
  private idConfig: number;
  private titulo: string;
  private isNovo: boolean = true;
  private profissional: Profissional;
  private configuracaoHorarioProfissional: ConfiguracaoHorarioProfissional;
  private subscription: Subscription;
  diaSemanaSelecionado: Array<String>;
  checkedSeg: boolean;
  checkedTer: boolean;
  checkedQua: boolean;
  checkedQui: boolean;
  checkedSex: boolean;
  checkedSab: boolean;
  checkedDom: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _profissionalService: ProfissionalService,
    private _profissionalListarService: ProfissionalListarService,
    private _usuarioService: UsuarioService) { }

  ngOnInit() {
    debugger
    this.profissional = new Profissional();
    this.configuracaoHorarioProfissional = new ConfiguracaoHorarioProfissional();
    this.setarCheckedInicial();

    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.isNovo = false;
          this.idProfissional = +params['id'];
          this._profissionalService.recuperarProfissionalPorId(this.idProfissional).subscribe(
            profissional => {
                this.profissional = profissional;
          });
          this._profissionalService.recuperarConfigProfissionalPorId(this.idProfissional).subscribe(
             result => {
                this.configuracaoHorarioProfissional = result;
                this.idConfig = result.id;
                this.configurarDiasDaSemanaCheckEdit();
             });
          this.titulo = 'Editar Profissional';
        } else {
          this.isNovo = true;
          this.profissional = new Profissional();
          this.titulo = 'Novo Profissional';
        }
        this.initForm();
        this.initFormConfig();
      }
    );
  }

  setarCheckedInicial(){
      this.checkedSeg = false;
      this.checkedTer = false;
      this.checkedQua = false;
      this.checkedQui = false;
      this.checkedSex = false;
      this.checkedSab = false;
      this.checkedDom = false;
  }

  configurarDiasDaSemanaCheckEdit(){
    debugger
    if (this.configuracaoHorarioProfissional != undefined && this.configuracaoHorarioProfissional != null){
      if (this.configuracaoHorarioProfissional.diasDaSemana != null && this.configuracaoHorarioProfissional.diasDaSemana != ''){
          this.diaSemanaSelecionado = new Array;
          var array : string[] = this.configuracaoHorarioProfissional.diasDaSemana.split(";");
          for (let i=0; i<array.length; i++) {
              switch(array[i]) { 
                  case 'DOM': { 
                    this.checkedDom = true;
                    this.diaSemanaSelecionado.push(array[i]);
                    break; 
                  }
                  case 'SEG': { 
                    this.checkedSeg = true;
                    this.diaSemanaSelecionado.push(array[i]);
                    break; 
                  }
                  case 'TER': { 
                    this.checkedTer = true;
                    this.diaSemanaSelecionado.push(array[i]);
                    break; 
                  }
                  case 'QUA': { 
                    this.checkedQua = true;
                    this.diaSemanaSelecionado.push(array[i]);
                    break; 
                  }
                  case 'QUI': { 
                    this.checkedQui = true;
                    this.diaSemanaSelecionado.push(array[i]);
                    break; 
                  }
                  case 'SEX': { 
                    this.checkedSex = true;
                    this.diaSemanaSelecionado.push(array[i]);
                    break; 
                  }
                  case 'SAB': { 
                    this.checkedSab = true;
                    this.diaSemanaSelecionado.push(array[i]);
                    break; 
                  }
              } 
          } 
        } 
     }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      nome: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['', [
        Validators.required,
      ]],
      telefone: ['', [
        Validators.required,
      ]],
      crm: ['', [
        Validators.required,
      ]]
    });
  }

  private initFormConfig() {
    this.formConfig = this.formBuilder.group({
      horarioInicio: ['', [
        Validators.required,
      ]],
      horarioFinal: ['', [
        Validators.required,
      ]],
      tempoConsulta: ['', [
        Validators.required,
      ]]
    });
  }

  onCancel() {
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigate(['/profissional']);
  }

  onSave() {

    this._usuarioService.recuperarUsuarioPorLogin(this.profissional.email).then(
      result => {
        if (result) {
          Materialize.toast('Email já está associado a um usuário no sistema', 4000, "");
          
        } else {

          	const valoresProfissional = this.form.value;
            const configuracao = this.formConfig.value;
            let result;
            let dias = this.configurarCheckDiaDaSemana();

            if (this.isNovo){
              result = this._profissionalService.add(valoresProfissional, configuracao, dias).subscribe(
                atualizar =>{
                      this._profissionalListarService.incluirProfissional(true);
                      this.navigateBack();
                }
              )
            } else {
              result = this._profissionalService.update(valoresProfissional, this.idProfissional, configuracao, this.idConfig, dias);
            }

            this.form.reset();

          result.subscribe(data => this.navigateBack(),
            err => {
              alert("An error occurred.");
            });

        }

    });
  }

  configurarCheckDiaDaSemana(){
    debugger
    let dias = '';
    if (this.diaSemanaSelecionado!= undefined){
      for (let i=0; i < this.diaSemanaSelecionado.length; i++) {
        dias += this.diaSemanaSelecionado[i] + ';';
      }
    }
    if (dias!=''){
      dias = dias.substring(0, dias.length - 1);
    }

    return dias;
  }

  updateCheckedOptions(event) {
    debugger
    let adicionado = false;
    let posicao;
    if (this.diaSemanaSelecionado != undefined){
      for (let i=0; i < this.diaSemanaSelecionado.length; i++) {
        if (this.diaSemanaSelecionado[i] === event.target.id) {
          adicionado = true;
          posicao = i;
          break;
        }
      }
    } else {
      this.diaSemanaSelecionado = new Array<String>();
    }

    if (event.target.checked) {
        if (!adicionado) {
          this.diaSemanaSelecionado.push(event.target.id);
        }
    } else {
      if (adicionado) {
        this.diaSemanaSelecionado.splice(posicao, 1);
      } 
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
