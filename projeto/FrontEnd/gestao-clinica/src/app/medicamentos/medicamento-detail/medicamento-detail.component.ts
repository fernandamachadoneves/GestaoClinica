import { MedicamentoListarService } from './../medicamentoListar.service';
import { MedicamentoService } from './../../shared/service/medicamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Medicamento } from './../../shared/models/medicamento';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medicamento-detail',
  templateUrl: './medicamento-detail.component.html',
  styleUrls: ['./medicamento-detail.component.css']
})
export class MedicamentoDetailComponent implements OnInit {
  private idMedicamento: number;
  private subscription: Subscription;
  medicamentoSelecionado: Medicamento;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _medicamentoService: MedicamentoService,
              private _medicamentoListarService: MedicamentoListarService) { }

  ngOnInit() {
    debugger
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.idMedicamento = params['id'];
        debugger
        this._medicamentoService.recuperarMedicamentoPorId(this.idMedicamento).subscribe(
            result => {
                this.medicamentoSelecionado = result;
        });
      });
  }

  editar() {
    this.router.navigate(['/medicamento', this.idMedicamento, 'edit']);
  }

  remover() {
    this._medicamentoService.remover(this.medicamentoSelecionado, this.idMedicamento).subscribe(
      result => this._medicamentoListarService.incluirMedicamento(true)
    );
    this.router.navigate(['/medicamento']);
  }

}
