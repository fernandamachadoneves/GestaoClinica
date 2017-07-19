import { PacienteListarService } from './../pacienteListar.service';
import { PacienteService } from './../../shared/service/paciente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Paciente } from './../../shared/models/paciente';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paciente-cadastro',
  templateUrl: './paciente-cadastro.component.html',
  styleUrls: ['./paciente-cadastro.component.css']
})
export class PacienteCadastroComponent implements OnInit {

  public maskTelefone = ['(', /[1-9]/, /\d/, ')', ' ',/\d/,/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  form: FormGroup;
  private idPaciente: number;;
  private titulo: string;
  private isNovo: boolean = true;
  private paciente: Paciente;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _pacienteService: PacienteService,
    private _pacienteListarService: PacienteListarService) { }

  ngOnInit() {
    this.paciente = new Paciente();

    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.isNovo = false;
          this.idPaciente = +params['id'];
          this._pacienteService.recuperarPacientePorId(this.idPaciente).subscribe(
            paciente => {
                this.paciente = paciente;
          });
          this.titulo = 'Editar Paciente';
        } else {
          this.isNovo = true;
          this.paciente = new Paciente();
          this.titulo = 'Novo Paciente';
        }
        this.initForm();
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
      ]]
    });
  }

  onCancel() {
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigate(['/paciente']);
  }

  onSave() {
    const valoresPaciente = this.form.value;
    let result;

    if (this.isNovo){
      result = this._pacienteService.add(valoresPaciente).subscribe(
        atualizar =>{
          this._pacienteListarService.incluirPaciente(true);
          this.navigateBack();
        }
      )
    } else {
      result = this._pacienteService.update(valoresPaciente, this.idPaciente);
    }

    this.form.reset();

  result.subscribe(data => this.navigateBack(),
    err => {
      alert("An error occurred.");
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
