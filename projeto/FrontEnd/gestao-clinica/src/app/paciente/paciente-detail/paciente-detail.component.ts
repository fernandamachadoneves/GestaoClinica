import { PacienteListarService } from './../pacienteListar.service';
import { PacienteService } from './../../shared/service/paciente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Paciente } from './../../shared/models/paciente';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paciente-detail',
  templateUrl: './paciente-detail.component.html',
  styleUrls: ['./paciente-detail.component.css']
})
export class PacienteDetailComponent implements OnInit {

 private idPaciente: number;
  private subscription: Subscription;
  pacienteSelecionado: Paciente;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _pacienteService: PacienteService,
              private _pacienteListarService: PacienteListarService) { }

  ngOnInit() {
    debugger
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.idPaciente = params['id'];
        debugger
        this._pacienteService.recuperarPacientePorId(this.idPaciente).subscribe(
            result => {
                this.pacienteSelecionado = result;
        });
      });
  }

  editar() {
    this.router.navigate(['/paciente', this.idPaciente, 'edit']);
  }

  remover() {
    this._pacienteService.remover(this.pacienteSelecionado, this.idPaciente).subscribe(
      result => this._pacienteListarService.incluirPaciente(true)
    );
    this.router.navigate(['/paciente']);
  }

}
