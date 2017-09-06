import { CookieService } from 'angular2-cookie/core';
import { MedicoGuard } from './../guards/medico.guard';
import { AuthService } from './../shared/auth.service';
import { RelatorioService } from './../shared/service/relatorio.service';
import { IMyOptions } from 'mydatepicker';
import { TipoResultadoExame } from './../shared/models/tipoResultadoExame';
import { EnumService } from './../shared/service/enum.service';
import { PedidoExame } from './../shared/models/PedidoExame';
import { PedidoExameService } from './../shared/service/pedidoExame.service.';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ItemPedidoExame } from './../shared/models/itemPedidoExame';
import { ExameService } from './../shared/service/exame.service';
import { Exame } from './../shared/models/exame';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-exames',
  templateUrl: './exames.component.html',
  styleUrls: ['./exames.component.css']
})
export class ExamesComponent implements OnInit {

  @ViewChild('tipo') tipo; 

  private model: Object;

  listExames = new Array<Exame>();
  listPedidosPaciente: Array<ItemPedidoExame>;
  itensPedidoExame: Array<ItemPedidoExame>;
  isNovo: boolean;
  private subscription: Subscription;
  idPaciente: number;
  idProfissoinal: number;
  pedidoExame: PedidoExame;
  exameLancarResultado: Exame;
  dataResulado: Date;
  resultadoObs: string;
  itemLancarResultado: ItemPedidoExame;
  itemEditarPedido: ItemPedidoExame;
  tipoResultado: string;

  private autoCompleteParams = [{'data': {}}];

  myDatePickerOptions: IMyOptions  = {
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

  constructor(private _exameService: ExameService,
              private route: ActivatedRoute,
              private _pedidoExame: PedidoExameService,
              private _enumService: EnumService,
              private _relatorioService: RelatorioService,
              private _autService: AuthService,
              private _medAut: MedicoGuard,
              private _cookie: CookieService) { }

  getAutocompleteParams(){
    this.autoCompleteParams[0].data[""]=null;
    for (let i=0; i<this.listExames.length; i++){
      this.autoCompleteParams[0].data[this.listExames[i].nomeExame]=null;
    }
    return this.autoCompleteParams;
  }

  ngOnInit() {
    this.exameLancarResultado = new Exame();
    this.itemLancarResultado = new ItemPedidoExame();
    this.itemEditarPedido = new ItemPedidoExame();
    this.itemEditarPedido.exame = new Exame();
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.idPaciente = params['id'];
        this.recuperarPedidos();
    });
  }

  recuperarPedidos(){
    this._pedidoExame.recuperarPedidosPorPaciente(this.idPaciente).subscribe(
      result => {
        this.listPedidosPaciente = result;
      }
    );
  }

  adicionarPedido(){
    debugger
    this.isNovo = true;
    this.itensPedidoExame = new Array<ItemPedidoExame>();
    $('.modal').modal({
       dismissible: true
    });
    this.listExames = new Array();
    this._exameService.recuperarExames().then(
      result => {
        this.listExames = result;
         $('select').material_select();
      }
    );
    this.criarItemPedidoExame();
  }

  lancarResultado(item: ItemPedidoExame){
    debugger
    this.tipoResultado = null;
    this.exameLancarResultado = item.exame;
    this.itemLancarResultado = item;
     $('.modal').modal({
       dismissible: true
    });
    let data = new Date();
    if (item.dataRealizacao != null && item.dataRealizacao !== undefined){
      data = new Date(item.dataRealizacao);
    }
    this.model = { date: { year: data.getFullYear(), month: data.getMonth() + 1, day: data.getDate() } }
    this.dataResulado = data;
    this.resultadoObs = item.resultadoObs;
    if (item.tipoResultado != null && item.tipoResultado !== undefined) {
       Materialize.updateTextFields();
       this.tipoResultado = item.tipoResultado.type;
    } 
    $('select').material_select();
  }

  onDateChanged(event) {
    debugger
    this.dataResulado = event.jsdate;
  }

  selecionouTipoResultado($event, tipo) {
    debugger
    if (tipo !== null && tipo !== undefined) {
      this._enumService.recuperarTipoResultadoPorType(tipo).then(
        result => {
           this.tipoResultado = result;
      });
    }
  }

    
  criarItemPedidoExame() {
    let itemPedidoExame = new ItemPedidoExame();
    itemPedidoExame.ativo = true;
    itemPedidoExame.exame = new Exame();

    this.itensPedidoExame.push(itemPedidoExame);
  }

  adicionarItemPedidoExame(){
    let itemPedidoExame = new ItemPedidoExame();
    itemPedidoExame.ativo = true;
    let ultimoRegistro = this.itensPedidoExame.length-1
    for (let i=0; i<this.itensPedidoExame.length; i++){
      if (ultimoRegistro==i){
        itemPedidoExame = this.itensPedidoExame[i];
      }
    }
    if (itemPedidoExame.justificativa==null || itemPedidoExame.justificativa==undefined
        || itemPedidoExame.exame==null || itemPedidoExame.exame==undefined) {

        Materialize.toast('É obrigatório informar os dados dos itens do pedido de exame para adicionar mais um', 4000, "");
    } else {
      this.criarItemPedidoExame();
    }
  }

  selecionouExame(event, exame, index){
    debugger
    let exameSelecionado: Exame;
    if (exame!==null && exame!== undefined){
      this._exameService.recuperarExamePorNome(exame).subscribe(
        result => {
          if (result!=null && result!=undefined){
            exameSelecionado = result[0];
            if (result.length==0){
               Materialize.toast('Exame não encontrado' , 4000, "");
               this.itensPedidoExame[index].exame = null;
            } else {
              for (let i=0; i<this.itensPedidoExame.length; i++){
                if (i==index){
                  this.itensPedidoExame[i].exame = exameSelecionado;
                }
              }
            }
          }
      },
      error => {
        exameSelecionado = null;
        for (let i=0; i<this.itensPedidoExame.length; i++){
          if (i==index){
            this.itensPedidoExame[i].exame = null;
          }
        }
      }
    );

    }
  }

  gravarPedido() {
    debugger
    if (this.validarItens()){
      if (this.isNovo){
        this._pedidoExame.addPedidoExame(this.idPaciente, this._cookie.get('idProfissional'), this.itensPedidoExame).subscribe(
          result=> {
            this._pedidoExame.recuperarPedidosPorPaciente(this.idPaciente).subscribe(
              lista => {
                this.listPedidosPaciente = lista;
              });
        });
      } else {
        this._pedidoExame.editarItensPedido(this.itensPedidoExame, this.pedidoExame).subscribe();
      }
      $('.modal').modal('close');
    }
  }

  validarItens() {
    debugger
    let validacaoOk = true;
    for (let i=0; i<this.itensPedidoExame.length;i++){
      if (this.itensPedidoExame[i].exame==null || this.itensPedidoExame[i].exame==undefined){
         validacaoOk = false;
         Materialize.toast('É obrigatório informar o exame do item ' + (i+1) , 4000, "");
      } else if (this.itensPedidoExame[i].justificativa==null || this.itensPedidoExame[i].justificativa==undefined){
         validacaoOk = false;
         Materialize.toast('É obrigatório informar a observação do item ' + (i+1) , 4000, "");
      }
    }
    return validacaoOk;
  }

  editarPedidoExame(pedidoExame: PedidoExame){
    this.pedidoExame = pedidoExame;
    this.isNovo = false;
    $('.modal').modal({dismissible: true});
    this._pedidoExame.recuperarItensPorIdPedidoExame(pedidoExame.id).subscribe(
      result => {
        this.itensPedidoExame = result;
        this.listExames = new Array();
        this._exameService.recuperarExames().then(
          result => {
              this.listExames = result;
              $('select').material_select();
          }
        );
    });
  }

  deletarItemPedidoExame(itemPedidoExame: ItemPedidoExame){
    this._pedidoExame.excluirItemPedidoExame(itemPedidoExame).subscribe(
      result => {
        this.recuperarPedidos(); 
      }
    )

  }

  removeItemPedidoExame(itemPedidoExame: ItemPedidoExame, index){
    if (itemPedidoExame.id!=null){
      for (let i=0; i<this.itensPedidoExame.length; i++){
        if (this.itensPedidoExame[i].id == itemPedidoExame.id){
          this.itensPedidoExame[i].ativo = false;
          this.itensPedidoExame.splice(index, 1);
        }
      }
    } else {
      this.itensPedidoExame.splice(index, 1);
    }
  }

  gravarResultadoExame(){
    debugger
    this.itemLancarResultado.resultadoObs = this.resultadoObs;
    this.itemLancarResultado.dataRealizacao = this.dataResulado;
    if (this.validarResultados()){
      this._enumService.recuperarTipoResultadoPorType(this.tipoResultado).then(
        resultEnum => {
          this.itemLancarResultado.tipoResultado = resultEnum;
        }
      );
      this._pedidoExame.lancarResultadoExame(this.itemLancarResultado).subscribe();
      $('.modal').modal('close');
    }
  }

  validarResultados() {
    let validacaoOk = true;
      if (this.itemLancarResultado.dataRealizacao==null || this.itemLancarResultado.dataRealizacao==undefined){
        validacaoOk = false;
        Materialize.toast('É obrigatório informar a data de realização do exame', 4000, "");
      } else if (this.tipoResultado==null || this.tipoResultado==undefined || this.tipoResultado ==''){
        validacaoOk = false;
        Materialize.toast('É obrigatório informar o resultado ', 4000, "");
      }
    
    return validacaoOk;
  }

  editarItemPedidoExame(item: ItemPedidoExame){
    this.itemEditarPedido = item;
    $('.modal').modal({dismissible: true});
    this._exameService.recuperarExames().then(
          result => {
              this.listExames = result;
              $('select').material_select();
      });
  }

  salvarEdicaoItemPedido(){
    if (this.validarItensEdicao()){
      this._pedidoExame.update(this.itemEditarPedido).subscribe();
      $('.modal').modal('close');
    }
  }

  validarItensEdicao() {
    debugger
    let validacaoOk = true;
      if (this.itemEditarPedido.exame==null || this.itemEditarPedido.exame==undefined){
         validacaoOk = false;
         Materialize.toast('É obrigatório informar o exame', 4000, "");
      } else if (this.itemEditarPedido.justificativa==null || this.itemEditarPedido.justificativa==undefined){
         validacaoOk = false;
         Materialize.toast('É obrigatório informar a observação' , 4000, "");
      }
    
    return validacaoOk;
  }

  selecionouExameEdicao(exame){
      debugger
      let exameSelecionado: Exame;
      if (exame!==null && exame!== undefined){
        this._exameService.recuperarExamePorNome(exame).subscribe(
          result => {
            if (result!=null && result!=undefined){
              exameSelecionado = result[0];
              this.itemEditarPedido.exame = exameSelecionado;
              if (result.length==0){
               Materialize.toast('Exame não encontrado' , 4000, "");
              }
            }
        },
        error => {
          exameSelecionado = null;
          this.itemEditarPedido.exame = null;
           Materialize.toast('Exame inválido' , 4000, "");
        }
      );

      }
    }

  gerarRelatorioResultadoExame(idItem: number) {
    this._relatorioService.gerarRelatorioResultadoExame(idItem).subscribe(res => {
      let link = document.createElement('a');
      document.body.appendChild(link);
      link.href = window.URL.createObjectURL(res);
      let nomeArquivo = 'resultadoExame' + '.pdf';
      link.download = nomeArquivo;
      link.click();
    });
  }  

  selecionarExamesPedido(){
    for (let i=0; i<this.listPedidosPaciente.length; i++){
      this.listPedidosPaciente[i].selecionado = false;
    }
    $('.modal').modal({dismissible: true});
  }

  checkExamePedido(event, exame){
    debugger
    for (let i=0; i<this.listPedidosPaciente.length; i++){
      if (exame.id == this.listPedidosPaciente[i].id){
        if (this.listPedidosPaciente[i].selecionado){
          this.listPedidosPaciente[i].selecionado = false;
        } else {
          this.listPedidosPaciente[i].selecionado = true;
        }
      }
    }
  }

  imprimirPedido(){
     let selecionou = false;
     for (let i=0; i<this.listPedidosPaciente.length; i++){
        if (this.listPedidosPaciente[i].selecionado){
          selecionou = true;
          break;
        }  
     }

     if (selecionou){
      this._relatorioService.gerarPedidoExame(this.listPedidosPaciente, this.idPaciente, this._cookie.get('idProfissional')).subscribe(res => {
        $('.modal').modal('close');
        let link = document.createElement('a');
        document.body.appendChild(link);
        link.href = window.URL.createObjectURL(res);
        let nomeArquivo = 'pedidoExame' + '.pdf';
        link.download = nomeArquivo;
        link.click();
        
      });
     } else {
       Materialize.toast('É necessário selecionar ao menos um exame para impressão do pedido' , 4000, "");
     }

  }
}
