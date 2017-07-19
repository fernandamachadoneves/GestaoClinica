import { MarcacaoConsulta } from './../../shared/models/marcacaoConsulta';
import { MarcacaoConsultaService } from './../../shared/service/marcacaoConsulta.service';
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
  pacienteAgendar: Paciente;
  horarioAgendar: string;
  listMarcacoes = new Array<MarcacaoConsulta>();

  private autoCompleteParams = [{'data': {}}];
   
  constructor(private _profissionalService: ProfissionalService,
              private _configHorProfService: ConfiguracaoHorarioProfissionalService,
              private router: Router,
              private _pacienteService: PacienteService,
              private _marcacaoConsultaService: MarcacaoConsultaService) { }

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

    var hora = new Date();
    hora.setHours(parseInt(inicio));
    hora.setMinutes(parseInt(arrayInicio[1]));


    this._marcacaoConsultaService.pesquisarMarcacoes(this.profissional, this.dataAgenda).subscribe(
      marcacoes => {
        this.listaConsultasProf = new Array();
        for (let i=0; i<numeroHorarios-1; i++) {
          let consultaHorario = new ConsultasProfissionalVO();
          consultaHorario.agendado = false;
          hora.setMinutes(hora.getMinutes() + this.configuracaoHorarioProfissional.tempoConsulta);
          let hour = (hora.getHours() < 10 ? '0' : '') + hora.getHours();
          let min = (hora.getMinutes() < 10 ? '0' : '') + hora.getMinutes();
          consultaHorario.horario = hour + ':' + min;
          consultaHorario.nomePaciente = '';

          for (let i=0; i<marcacoes.length; i++) {
            if (consultaHorario.horario===marcacoes[i].horario){
              consultaHorario.agendado = true;
              consultaHorario.nomePaciente = marcacoes[i].paciente.nome;
              consultaHorario.idMarcacaoConsulta = marcacoes[i].id;
            }
          }

          this.listaConsultasProf.push(consultaHorario);
        } 
        
    });

    this.pesquisou = true;
  }

  agendar(horario: string){
    this.horarioAgendar = horario; 
    $('.modal').modal();
    this.idPaciente = 0;
    this.listPacientes = new Array();
    this._pacienteService.recuperarPacientes().then(
      result => {
        this.listPacientes = result;
      }
    );
  }

  selecionouPaciente($event, pacSelecionado) {
    if (pacSelecionado!==null && pacSelecionado!== undefined){
      this._pacienteService.recuperarPacientePorNome(pacSelecionado).subscribe(
        result => {
          if (result!=null && result!=undefined){
            this.pacienteAgendar = result[0];
          }
      });
    }
  }

  marcaConsulta() {
    let consulta = this.marcarHorario(this.dataAgenda, this.horarioAgendar);
    this._marcacaoConsultaService.marcar(consulta, this.pacienteAgendar, this.profissional).subscribe(
      result =>{
        this.pesquisar();
      }
    );
  }

   marcarHorario(data: Date, horario: string) {
    let marcacaoConsulta = new MarcacaoConsulta();
    marcacaoConsulta.dataAgendamento = new Date();
    marcacaoConsulta.dataConsulta = data;
    marcacaoConsulta.horario = horario;

    return marcacaoConsulta;
  }

  desmarcar(idMarcacaoConsulta: number){
    this._marcacaoConsultaService.desmarcar(idMarcacaoConsulta).subscribe(
      result => {
        this.pesquisar();
      }
    )
  }
}
