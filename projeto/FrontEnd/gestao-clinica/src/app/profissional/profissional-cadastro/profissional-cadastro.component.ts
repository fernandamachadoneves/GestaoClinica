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
  private titulo: string;
  private isNovo: boolean = true;
  private profissional: Profissional;
  private configuracaoHorarioProfissional: ConfiguracaoHorarioProfissional;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _profissionalService: ProfissionalService) { }

  ngOnInit() {
    this.profissional = new Profissional();
    this.configuracaoHorarioProfissional = new ConfiguracaoHorarioProfissional();

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
    debugger
    this.router.navigate(['/profissional']);
  }

  onSave() {
    debugger
    const valoresProfissional = this.form.value;
    const configuracao = this.formConfig.value;
    let result;

    if (this.isNovo){
      result = this._profissionalService.add(valoresProfissional, configuracao);
    } else {
      result = this._profissionalService.update(valoresProfissional, this.idProfissional);
    }

    this.form.reset();

  result.subscribe(data => this.navigateBack(),
    err => {
      debugger
      alert("An error occurred.");
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
