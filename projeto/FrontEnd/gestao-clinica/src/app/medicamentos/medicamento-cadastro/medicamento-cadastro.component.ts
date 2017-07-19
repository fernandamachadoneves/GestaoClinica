import { MedicamentoListarService } from './../medicamentoListar.service';
import { MedicamentoService } from './../../shared/service/medicamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Medicamento } from './../../shared/models/medicamento';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medicamento-cadastro',
  templateUrl: './medicamento-cadastro.component.html',
  styleUrls: ['./medicamento-cadastro.component.css']
})
export class MedicamentoCadastroComponent implements OnInit {

  form: FormGroup;
  private idMedicamento: number;;
  private titulo: string;
  private isNovo: boolean = true;
  private medicamento: Medicamento;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _medicamentoService: MedicamentoService,
    private _medicamentoListarService: MedicamentoListarService) { }

  ngOnInit() {
    this.medicamento = new Medicamento();

    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.isNovo = false;
          this.idMedicamento = +params['id'];
          this._medicamentoService.recuperarMedicamentoPorId(this.idMedicamento).subscribe(
            medicamento => {
                this.medicamento = medicamento;
          });
          this.titulo = 'Editar Medicamento';
        } else {
          this.isNovo = true;
          this.medicamento = new Medicamento();
          this.titulo = 'Novo Medicamento';
        }
        this.initForm();
      }
    );
  }

  private initForm() {
    this.form = this.formBuilder.group({
      nomeGenerico: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      nomeFabricante: ['', [
        Validators.required,
      ]],
      fabricante: ['', [
        Validators.required,
      ]]
    });
  }

  onCancel() {
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigate(['/medicamento']);
  }

  onSave() {
    const valoresMedicamento = this.form.value;
    let result;

    if (this.isNovo){
      result = this._medicamentoService.add(valoresMedicamento).subscribe(
        atualizar =>{
          this._medicamentoListarService.incluirMedicamento(true);
          this.navigateBack();
        }
      )
    } else {
      result = this._medicamentoService.update(valoresMedicamento, this.idMedicamento);
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
