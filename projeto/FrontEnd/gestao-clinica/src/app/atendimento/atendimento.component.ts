import { Paciente } from './../shared/models/paciente';
import { PacienteService } from './../shared/service/paciente.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.css']
})
export class AtendimentoComponent implements OnInit {

  constructor(private _pacienteService: PacienteService) { }

  pacientes = new Array<Paciente>();
  pacientePesquisa: string;

  ngOnInit() {
  }

  pesquisar() {
    if (this.pacientePesquisa != ''){
      this._pacienteService.recuperarPacientePorNome(this.pacientePesquisa).subscribe(
        result => {
          if (result.length == 0) {
            Materialize.toast('Nenhum paciente foi encontrado com o nome informado', 4000, "");
          }
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
