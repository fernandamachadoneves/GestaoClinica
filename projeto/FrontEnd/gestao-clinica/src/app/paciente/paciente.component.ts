import { PacienteListarService } from './pacienteListar.service';
import { PacienteService } from './../shared/service/paciente.service';
import { Paciente } from './../shared/models/paciente';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  pacientes = new Array<Paciente>();
  pacientePesquisa: string;

  constructor(private _pacienteService: PacienteService) { }

  ngOnInit() {
    this._pacienteService.getPacientes().subscribe(
      result => {
        this.pacientes = result;
      }
    );
    PacienteListarService.incluiuPaciente.subscribe(
      profNovo => {
        if (profNovo){
            this._pacienteService.getPacientes().subscribe(
                result => {
                  this.pacientes = result;
            }
          );
        }
      }
      
    );
  }

  pesquisar(){
    if (this.pacientePesquisa != ''){
      this._pacienteService.recuperarPacientePorNome(this.pacientePesquisa).subscribe(
        result => {
          this.pacientes = result;
        }
      );
    } else {
      this._pacienteService.getPacientes().subscribe(
        result => {
          this.pacientes = result;
        }
      );
    }
  }

}
