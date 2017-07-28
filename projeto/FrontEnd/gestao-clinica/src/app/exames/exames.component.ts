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

  listExames = new Array<Exame>();
  listPedidosPaciente: Array<ItemPedidoExame>;
  itensPedidoExame: Array<ItemPedidoExame>;
  isNovo: boolean;
  private subscription: Subscription;
  idPaciente: number;
  idProfissoinal: number;
  pedidoExame: PedidoExame;
  tipoResultadoExameOptions = Array<TipoResultadoExame>();
  exameLancarResultado: Exame;
  dataResulado: Date;
  tipoResultado: TipoResultadoExame;
  resultadoObs: string;
  itemLancarResultado: ItemPedidoExame;
  itemEditarPedido: ItemPedidoExame;

  private autoCompleteParams = [{'data': {}}];

  constructor(private _exameService: ExameService,
              private route: ActivatedRoute,
              private _pedidoExame: PedidoExameService,
              private _enumService: EnumService) { }

  getAutocompleteParams(){
    this.autoCompleteParams[0].data[""]=null;
    for (let i=0; i<this.listExames.length; i++){
      this.autoCompleteParams[0].data[this.listExames[i].nomeExame]=null;
    }
    return this.autoCompleteParams;
  }

  ngOnInit() {
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
    this.exameLancarResultado = item.exame;
    this.itemLancarResultado = item;
     $('.modal').modal({
       dismissible: true
    });
    $('select').material_select();
    this._enumService.getEnum('TipoResultadoExame').subscribe(tipos => this.tipoResultadoExameOptions = tipos);
  }

  alterarData(event) {
    this.dataResulado = event.dataJson;
  }

  selecionouTipoResultado($event, tipo) {
    if (tipo !== null && tipo !== undefined) {
      this._enumService.recuperarTipoResultadoPorType(tipo).subscribe(
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
        this._pedidoExame.addPedidoExame(this.idPaciente, this.idProfissoinal, this.itensPedidoExame).subscribe(
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
    this.itemLancarResultado.tipoResultado = this.tipoResultado;
    if (this.validarResultados()){
      this._pedidoExame.lancarResultadoExame(this.itemLancarResultado).subscribe();
      $('.modal').modal('close');
    }
  }

  validarResultados() {
    let validacaoOk = true;
      if (this.itemLancarResultado.dataRealizacao==null || this.itemLancarResultado.dataRealizacao==undefined){
        validacaoOk = false;
         Materialize.toast('É obrigatório informar a data de realização do exame', 4000, "");
      } else if (this.itemLancarResultado.tipoResultado==null || this.itemLancarResultado.tipoResultado==undefined){
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
}
