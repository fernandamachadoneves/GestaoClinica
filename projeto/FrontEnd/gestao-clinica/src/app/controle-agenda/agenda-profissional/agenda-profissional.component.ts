import { ConfiguracaoHorarioProfissionalService } from './../../shared/service/configuracaoHorarioProfissional.service';
import { ProfissionalService } from './../../shared/profissional.service';
import { Profissional } from './../../shared/models/profissional';
import { Component, OnInit } from '@angular/core';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';

@Component({
  selector: 'app-agenda-profissional',
  templateUrl: './agenda-profissional.component.html',
  styleUrls: ['./agenda-profissional.component.css']
})
export class AgendaProfissionalComponent implements OnInit {
  
  listProfissionais = new Array<Profissional>();
  idProfissional: number;
  data: Object;
  dias: Array<string>;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd/mm/yyyy',
    firstDayOfWeek: 'mo',
    dayLabels: {su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab'},
    monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
    todayBtnTxt: 'Hoje',
    width: '135px',
    height: '24px',
    selectionTxtFontSize: '14px',
    inline: false,
    editableDateField: false,
    openSelectorOnInputClick: true,
    showClearDateBtn: false
  };

  constructor(private _profissionalService: ProfissionalService,
              private _configHorProfService: ConfiguracaoHorarioProfissionalService) { }

  ngOnInit() {
    debugger
    this.myDatePickerOptions.disableWeekdays = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    this.iniciarFiltros();

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
    
    // let data = new Date();
    //this.data = { date: { year: data.getFullYear(), month: data.getMonth() + 1, day: data.getDate() } }
  }


  onDateChanged(event: IMyDateModel) {
    this.data = event.jsdate;
  }

  pesquisar() {
    debugger
    this._profissionalService.recuperarConfigProfissional(this.idProfissional).then(
      result => {
          this.recuperarDiasDaSemana(result.diasDaSemana);
      }
    );
  }

  teste(){
    debugger

    let array = new Array();
    array.push('\'tu\'');
    
    array.toString().replace(/\"/g, "");
    
    this.myDatePickerOptions.disableWeekdays = array;

  }

  recuperarDiasDaSemana(configProfDias: string) {
    debugger
    let teste = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    let array = new Array;
    array.push('tu');
    
    let diasSemanaBloquear
    diasSemanaBloquear += "'" + 'tu' + "'";
    
    this.myDatePickerOptions.disableWeekdays = array;

    this.myDatePickerOptions.disableWeekdays = [diasSemanaBloquear];

  //  teste.splice(2, 1);
   // teste.splice(3, 1);
   // var RegExp = /["|']/g;
  //	teste.toString().replace(RegExp,"");
    //teste.toString().replace("\"", "'");
    //teste.toString().replace('\"', "\\u0022");
    //var teste = { a: function(a){ console.log(a.name); } }
    //teste.a({name:'\'a\''});
    //teste.push('\'su\'')
    //teste.toString().replace(/[\\"]/g, '');
    //let pos = teste.indexOf('su');
    //teste.slice(pos);  

    /*

    debugger

    let diasSemanaBloquear = '';

    let diasSemana = [
      {dia: 'DOM', atributo: 'su', bloquear: true},
      {dia: 'SEG', atributo: 'mo', bloquear: true},
      {dia: 'TER', atributo: 'tu', bloquear: true},
      {dia: 'QUA', atributo: 'we', bloquear: true},
      {dia: 'QUI', atributo: 'th', bloquear: true},
      {dia: 'SEX', atributo: 'fr', bloquear: true},
      {dia: 'SAB', atributo: 'sa', bloquear: true},
    ]

    var array : string[] = configProfDias.split(";");
    for (let i=0; i<diasSemana.length; i++) {
        for (let j=0; j<array.length; j++) {
           if (diasSemana[i].dia == array[j]){
             diasSemana[i].bloquear = false;
           }
        }
    }

    // dias que o profissional não atende
    for (let i=0; i<diasSemana.length; i++) {
      if (diasSemana[i].bloquear){
        diasSemanaBloquear += "'" + diasSemana[i].atributo + "', "
      }
    }

    if (diasSemanaBloquear!=''){
      //diasSemanaBloquear = diasSemanaBloquear.substr(1,(diasSemanaBloquear.length - 1));
      diasSemanaBloquear = diasSemanaBloquear.substr(0, diasSemanaBloquear.length - 2);
      console.log(diasSemanaBloquear);
      diasSemanaBloquear.replace('\"', '\'');
      this.myDatePickerOptions.disableWeekdays = [diasSemanaBloquear];

      this.myDatePickerOptions.disableWeekdays = [diasSemanaBloquear];
    }
  */
  }
}
