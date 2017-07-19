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
}
