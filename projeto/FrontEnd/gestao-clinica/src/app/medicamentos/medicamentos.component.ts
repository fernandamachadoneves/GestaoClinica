import { MedicamentoListarService } from './medicamentoListar.service';
import { Medicamento } from './../shared/models/medicamento';
import { MedicamentoService } from './../shared/service/medicamento.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class MedicamentosComponent implements OnInit {

  medicamentos: Array<Medicamento>;
  medicamentoPesquisa: string;

  constructor(private _medicamentoService: MedicamentoService) { }

  ngOnInit() {
  this._medicamentoService.getMedicamentos().subscribe(
      result => {
        this.medicamentos = result;
      }
    );
    MedicamentoListarService.incluiuMedicamento.subscribe(
      medNovo => {
        if (medNovo){
            this._medicamentoService.getMedicamentos().subscribe(
                result => {
                  this.medicamentos = result;
            }
          );
        }
      }
      
    );
  }

  pesquisar(){
    if (this.medicamentoPesquisa != ''){
      this._medicamentoService.recuperarMedicamentoPorNomeGenerico(this.medicamentoPesquisa).subscribe(
        result => {
           if (result.length == 0) {
            Materialize.toast('Nenhum medicamento foi encontrado com o nome informado', 4000, "");
          }
          this.medicamentos = result;
        }
      );
    } else {
      this._medicamentoService.getMedicamentos().subscribe(
        result => {
          this.medicamentos = result;
        }
      );
    }
  }
}
