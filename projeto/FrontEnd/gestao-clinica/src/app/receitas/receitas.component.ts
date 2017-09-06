import { CookieService } from 'angular2-cookie/core';
import { MedicoGuard } from './../guards/medico.guard';
import { Headers, RequestOptions } from '@angular/http';
import { RelatorioService } from './../shared/service/relatorio.service';
import { MedicamentoService } from './../shared/service/medicamento.service';
import { Medicamento } from './../shared/models/medicamento';
import { ItemReceita } from './../shared/models/itemReceita';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ReceitaService } from './../shared/service/receita.service';
import { Receita } from './../shared/models/receita';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoDosagem } from './../shared/models/tipoDosagem';
import { EnumService } from './../shared/service/enum.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receitas',
  templateUrl: './receitas.component.html',
  styleUrls: ['./receitas.component.css']
})
export class ReceitasComponent implements OnInit {
 
  idPaciente: number;
  idProfissoinal: number;
  descricao: number;
  private subscription: Subscription;
  itensReceita: Array<ItemReceita>;
  listMedicamentos = new Array<Medicamento>();
  listReceitas = new Array<Receita>();
  medicamentoItem;
  isNovo: boolean;
  receita: Receita;

  private autoCompleteParams = [{'data': {}}];

  constructor(private _enumService: EnumService,
              private _receitaService: ReceitaService,
              private route: ActivatedRoute,
              private _medicamentoService: MedicamentoService,
              private _relatorioService: RelatorioService,
              private _medAut: MedicoGuard,
              private _cookie: CookieService) { }

  getAutocompleteParams(){
    this.autoCompleteParams[0].data[""]=null;
    for (let i=0; i<this.listMedicamentos.length; i++){
      this.autoCompleteParams[0].data[this.listMedicamentos[i].nomeGenerico]=null;
    }
    return this.autoCompleteParams;
  }

  ngOnInit() {
    debugger
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.idPaciente = params['id'];
        this.recuperarReceitas();
    });
  }

  recuperarReceitas(){
    this._receitaService.recuperarReceitaPorPaciente(this.idPaciente).subscribe(
      result => {
        this.listReceitas = result;
      }
    );
  }

  adicionarReceita(){
    this.isNovo = true;
    this.itensReceita = new Array<ItemReceita>();
     $('.modal').modal({
       dismissible: true
    }
    );
    this.listMedicamentos = new Array();
    this._medicamentoService.recuperarMedicamentos().then(
      result => {
        this.listMedicamentos = result;
         $('select').material_select();
      }
    );
    this.criarItemReceita();
  }

  criarItemReceita() {
    let itemReceita = new ItemReceita();
    itemReceita.ativo = true;
    itemReceita.medicamento = new Medicamento();

    this.itensReceita.push(itemReceita);
  }

  adicionarItemReceita(){
    let itemReceita = new ItemReceita();
    itemReceita.ativo = true;
    let ultimoRegistro = this.itensReceita.length-1
    for (let i=0; i<this.itensReceita.length; i++){
      if (ultimoRegistro==i){
        itemReceita = this.itensReceita[i];
      }
    }
    if (itemReceita.descricao==null || itemReceita.descricao==undefined
        || itemReceita.medicamento==null || itemReceita.medicamento==undefined) {

        Materialize.toast('É obrigatório informar os dados dos itens da receita para adicionar mais um', 4000, "");
    } else {
      this.criarItemReceita();
    }
  }

  selecionouMedicamento(event, medic, index){
    debugger
    let medicamentoSelecionado: Medicamento;
    if (medic!==null && medic!== undefined){
      this._medicamentoService.recuperarMedicamentoPorNomeGenerico(medic).subscribe(
        result => {
          if (result!=null && result!=undefined){
            medicamentoSelecionado = result[0];
            for (let i=0; i<this.itensReceita.length; i++){
              if (i==index){
                this.itensReceita[i].medicamento = medicamentoSelecionado;
              }
            }
          }
      },
      error => {
        medicamentoSelecionado = null;
        for (let i=0; i<this.itensReceita.length; i++){
          if (i==index){
            this.itensReceita[i].medicamento = null;
          }
        }
      }
    );

    }
  }

  gravarReceita() {
    debugger
    if (this.validarItens()){
      if (this.isNovo){
        this._receitaService.addReceita(this.idPaciente, this._cookie.get('idProfissional'), this.itensReceita).subscribe(
          result=> {
            this._receitaService.recuperarReceitaPorPaciente(this.idPaciente).subscribe(
              lista => {
                this.listReceitas = lista;
              });
        });
      } else {
        this._receitaService.editarItensReceita(this.itensReceita, this.receita).subscribe();
      }
      $('.modal').modal('close');
    }
  }

  validarItens() {
    debugger
    let validacaoOk = true;
    for (let i=0; i<this.itensReceita.length;i++){
      if (this.itensReceita[i].medicamento==null || this.itensReceita[i].medicamento==undefined){
        validacaoOk = false;
         Materialize.toast('É obrigatório informar o medicamento do item ' + (i+1) , 4000, "");
      } else if (this.itensReceita[i].descricao==null || this.itensReceita[i].descricao==undefined){
        validacaoOk = false;
         Materialize.toast('É obrigatório informar a descrição do item ' + (i+1) , 4000, "");
      }
    }
    return validacaoOk;
  }

  gerarReceita(idReceita: number) {
    this._relatorioService.gerarRelatorio(idReceita).subscribe(res => {
     	let link = document.createElement('a');
      document.body.appendChild(link);
      link.href = window.URL.createObjectURL(res);
      let nomeArquivo = 'receitaMedica' + '.pdf';
      link.download = nomeArquivo;
      link.click();

    });
  }

  editarReceita(receita: Receita){
    this.receita = receita;
    this.isNovo = false;
    $('.modal').modal({dismissible: true});
    this._receitaService.recuperarItensPorIdReceita(receita.id).subscribe(
      result => {
        this.itensReceita = result;
        this.listMedicamentos = new Array();
        this._medicamentoService.recuperarMedicamentos().then(
          result => {
              this.listMedicamentos = result;
              $('select').material_select();
          }
        );
    });
  }

  deletarReceita(receita: Receita){
    this._receitaService.update(receita).subscribe(
      result => {
        this._receitaService.recuperarReceitaPorPaciente(this.idPaciente).subscribe(
            lista => {
              this.listReceitas = lista;
            });
      }
    );
  }

  removeItemReceita(itemReceita: ItemReceita, index){
    if (itemReceita.id!=null){
      for (let i=0; i<this.itensReceita.length; i++){
        if (this.itensReceita[i].id == itemReceita.id){
          this.itensReceita[i].ativo = false;
          this.itensReceita.splice(index, 1);
        }
      }
    } else {
      this.itensReceita.splice(index, 1);
    }
  }
}
