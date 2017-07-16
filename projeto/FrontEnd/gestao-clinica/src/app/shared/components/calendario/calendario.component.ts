import { ConfiguracaoHorarioProfissional } from './../../models/configuracaoHorarioProfissional';
import { ProfissionalService } from './../../profissional.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';

@Component({
  selector: 'calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

@Input() idProfissional: number;
data: Object; 
@Output() alterouData = new EventEmitter();
configProf: ConfiguracaoHorarioProfissional;
dataAtual = new Date();

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
    showClearDateBtn: false,
    disableUntil: { year: this.dataAtual.getFullYear(), month: this.dataAtual.getMonth()+1, day: this.dataAtual.getDate() }
  };

  constructor(private _profissionalService: ProfissionalService) { }

  ngOnInit() {
 
  }

  ngOnChanges() {  
    debugger
    console.log('ngOnChanges: '+  this.idProfissional);
    this.myDatePickerOptions.disableWeekdays = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    this._profissionalService.recuperarConfigProfissional(this.idProfissional).then(
      result => {
          this.configProf = result;
          this.recuperarDiasDaSemana(result.diasDaSemana);
      }
    );
    
  }

  onDateChanged(event: IMyDateModel) {
    this.alterouData.emit({novaData: event.formatted, dataJson: event.jsdate, configProf: this.configProf});
  }

  recuperarDiasDaSemana(configProfDias: string) {
    debugger
    let diasSemana = [
      {dia: 'DOM', atributo: 'su', pos: 0, bloquear: true},
      {dia: 'SEG', atributo: 'mo', pos: 1, bloquear: true},
      {dia: 'TER', atributo: 'tu', pos: 2, bloquear: true},
      {dia: 'QUA', atributo: 'we', pos: 3, bloquear: true},
      {dia: 'QUI', atributo: 'th', pos: 4, bloquear: true},
      {dia: 'SEX', atributo: 'fr', pos: 5, bloquear: true},
      {dia: 'SAB', atributo: 'sa', pos: 6, bloquear: true},
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
    var diasDesbloquear: number[] = new Array();
    for (let i=0; i<diasSemana.length; i++) {
      if (!diasSemana[i].bloquear){
        this.myDatePickerOptions.disableWeekdays.splice(this.recuperarPosicaoWeekDays(diasSemana[i].atributo), 1);
      }
    }
  }

  recuperarPosicaoWeekDays(diaSemana: string) {
    for(let i=0; i<this.myDatePickerOptions.disableWeekdays.length; i++){
      if (this.myDatePickerOptions.disableWeekdays[i]==diaSemana){
        return i;
      }
    }
  }

}
