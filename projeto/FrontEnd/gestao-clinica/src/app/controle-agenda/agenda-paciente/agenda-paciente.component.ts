import { MarcacaoConsulta } from './../../shared/models/marcacaoConsulta';
import { MarcacaoConsultaService } from './../../shared/service/marcacaoConsulta.service';
import { PacienteService } from './../../shared/service/paciente.service';
import { Paciente } from './../../shared/models/paciente';
import { Component, OnInit } from '@angular/core';

declare var Materialize:any;

@Component({
  selector: 'app-agenda-paciente',
  templateUrl: './agenda-paciente.component.html',
  styleUrls: ['./agenda-paciente.component.css']
})
export class AgendaPacienteComponent implements OnInit {

  private autoCompleteParams = [{'data': {}}];
  listPacientes = new Array<Paciente>();
  pacienteSelecionado: Paciente;
  exibirPesquisar: boolean;
  listConsultas = new Array<MarcacaoConsulta>();

  constructor(private _pacienteService: PacienteService,
              private _marcacoesConsultaService: MarcacaoConsultaService) { }

  ngOnInit() {
    //this.idPaciente = 0;
    //this.pac.nativeElement.value = '';
    //this.pacienteAgendar = new Paciente();
    this.exibirPesquisar = false;
    this.listPacientes = new Array();
    this._pacienteService.recuperarPacientes().then(
      result => {
        this.listPacientes = result;
      }
    );
  }

  getAutocompleteParams(){
    this.autoCompleteParams[0].data[""]=null;
    for (let i=0; i<this.listPacientes.length; i++){
      this.autoCompleteParams[0].data[this.listPacientes[i].nome]=null;
    }
    return this.autoCompleteParams;
  }

   selecionouPaciente($event, pacSelecionado) {
    if (pacSelecionado!==null && pacSelecionado!== undefined){
      this._pacienteService.recuperarPacientePorNome(pacSelecionado).subscribe(
        result => {
          if (result!=null && result!=undefined){
            this.pacienteSelecionado = result[0];
            this.exibirPesquisar = true;
          }
      });
    }
  }

  desmarcar(item: MarcacaoConsulta){
    this._marcacoesConsultaService.desmarcar(item.id).subscribe(
      result => {
        this._marcacoesConsultaService.pesquisarAgendamentosPaciente(this.pacienteSelecionado.id).subscribe(
            marcacoes => {
              if (marcacoes!==null && marcacoes!=undefined && marcacoes.length > 0){
                this.listConsultas = marcacoes;
              } else {
                Materialize.toast('Paciente não possui nenhuma consulta agendada', 3000, "");
              }
          });
      }
    );
  }

  pesquisar(){
    debugger
     this._marcacoesConsultaService.pesquisarAgendamentosPaciente(this.pacienteSelecionado.id).subscribe(
      marcacoes => {
        if (marcacoes!==null && marcacoes!=undefined && marcacoes.length > 0){
          this.listConsultas = marcacoes;
        } else {
          Materialize.toast('Paciente não possui nenhuma consulta agendada', 3000, "");
        }
    });
  }

}
