import { PacienteService } from './../../shared/service/paciente.service';
import { Paciente } from './../../shared/models/paciente';
import { ConsultasProfissionalVO } from './../../shared/models/consultaProfissionalVO';
import { ConfiguracaoHorarioProfissional } from './../../shared/models/configuracaoHorarioProfissional';
import { ConfiguracaoHorarioProfissionalService } from './../../shared/service/configuracaoHorarioProfissional.service';
import { ProfissionalService } from './../../shared/profissional.service';
import { Profissional } from './../../shared/models/profissional';
import { Component, OnInit } from '@angular/core';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agenda-profissional',
  templateUrl: './agenda-profissional.component.html',
  styleUrls: ['./agenda-profissional.component.css']
})
export class AgendaProfissionalComponent implements OnInit {
  
  
  listProfissionais = new Array<Profissional>();
  idProfissional: number;
  dias: Array<string>;
  selecionouProfissional: boolean;
  dataAgenda: Date;
  configuracaoHorarioProfissional: ConfiguracaoHorarioProfissional;
  pesquisou: boolean;
  listaConsultasProf = new Array<ConsultasProfissionalVO>();
  profissional: Profissional;
  listPacientes = new Array<Paciente>();
  idPaciente: number;
  teste: string;
  private autoCompleteParams = [{'data': {}}];
   
  constructor(private _profissionalService: ProfissionalService,
              private _configHorProfService: ConfiguracaoHorarioProfissionalService,
              private router: Router,
              private _pacienteService: PacienteService) { }

  getAutocompleteParams(){
    this.autoCompleteParams[0].data[""]=null;
    for (let i=0; i<this.listPacientes.length; i++){
      this.autoCompleteParams[0].data[this.listPacientes[i].nome]=null;
    }
    return this.autoCompleteParams;
  }
  

  ngOnInit() {
    debugger
    this.iniciarFiltros();
    this.selecionouProfissional = false;
    this.pesquisou = false;
  }

  alterarProfissional(){
    this.router.navigate(['/controleAgenda']);
  }

  selecionouProfissinal($event, profSecionado) {
    debugger;
    this.idProfissional = profSecionado;
    this.selecionouProfissional = true;
    this._profissionalService.recuperarProfissionalPorId(this.idProfissional).subscribe(
      profissional => {
          this.profissional = profissional;
    });
  }

  iniciarFiltros(){
    debugger;
    this.idProfissional = 0;
    this.listProfissionais = new Array();
    this._profissionalService.recuperarProfissionais().then(
      result => {
        this.listProfissionais = result;
         $('select').material_select();
      }
    );
  }
   
  alterarData(event) {
    this.dataAgenda = event.dataJson;
    this.configuracaoHorarioProfissional = event.configProf;
  }

  pesquisar() {
    debugger
    let horInicio = this.configuracaoHorarioProfissional.horarioInicio;
    let horFim = this.configuracaoHorarioProfissional.horarioFinal;
    
    let arrayInicio = horInicio.split(':');
    var inicio = arrayInicio[0]; 

    let arrayFim = horFim.split(':');
    let fim = arrayFim[0]; 

    let diferencaTempoHoras = parseInt(fim) - parseInt(inicio);
    let diferencaTempoMin = diferencaTempoHoras * 60;
    
    let numeroHorarios = diferencaTempoMin / this.configuracaoHorarioProfissional.tempoConsulta;
    
    let consultaHorario = new ConsultasProfissionalVO();

    var hora = new Date();
    hora.setHours(parseInt(inicio));
    hora.setMinutes(parseInt(arrayInicio[1]));

    consultaHorario.agendado = true;
    consultaHorario.horario = (hora.getHours() < 10 ? '0' : '') + hora.getHours() + ':' + (hora.getMinutes() < 10 ? '0' : '') + hora.getMinutes() 
    consultaHorario.nomePaciente = 'Fernanda Machado Neves da Silva';

    this.listaConsultasProf.push(consultaHorario);

    for (let i=0; i<numeroHorarios-1; i++) {
      let consultaHorario = new ConsultasProfissionalVO();
      consultaHorario.agendado = false;
      hora.setMinutes(hora.getMinutes() + this.configuracaoHorarioProfissional.tempoConsulta);
      let hour = (hora.getHours() < 10 ? '0' : '') + hora.getHours();
      let min = (hora.getMinutes() < 10 ? '0' : '') + hora.getMinutes();
      consultaHorario.horario = hour + ':' + min;
      consultaHorario.nomePaciente = '';
      this.listaConsultasProf.push(consultaHorario);
    }

    this.pesquisou = true;
  }

  agendar(){
    $('.modal').modal();
    this.idPaciente = 0;
    this.listPacientes = new Array();
    this._pacienteService.recuperarPacientes().then(
      result => {
        this.listPacientes = result;
         $('select').material_select();
      }
    );
  }
}
