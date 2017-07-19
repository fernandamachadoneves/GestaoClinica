import { PacienteService } from './../shared/service/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Paciente } from './../shared/models/paciente';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prontuario',
  templateUrl: './prontuario.component.html',
  styleUrls: ['./prontuario.component.css']
})
export class ProntuarioComponent implements OnInit {

  paciente: Paciente;
  private subscription: Subscription;
  idPaciente: number;

  constructor(private route: ActivatedRoute,
              private _pacienteService: PacienteService) { }

  ngOnInit() {
    this.paciente = new Paciente();

    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.idPaciente = +params['id'];
          this._pacienteService.recuperarPacientePorId(this.idPaciente).subscribe(
            paciente => {
                this.paciente = paciente;
          });
        }
      }
    );
  }

}
