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
 
  tipoDosagemOptions = Array<TipoDosagem>();
  dosagem: string;
  quantidade: number;
  dias: number;
  idPaciente: number;
  idProfissoinal: number;
  frequencia: number;
  private subscription: Subscription;
  itensReceita: Array<ItemReceita>;
  listMedicamentos = new Array<Medicamento>();
  listReceitas = new Array<Receita>();

  private autoCompleteParams = [{'data': {}}];

  constructor(private _enumService: EnumService,
              private _receitaService: ReceitaService,
              private route: ActivatedRoute,
              private _medicamentoService: MedicamentoService,
              private _relatorioService: RelatorioService) { }

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
    debugger
    this.itensReceita = new Array<ItemReceita>();
    $('select').material_select();
    this._enumService.getEnum('TipoDosagem').subscribe(tipos => this.tipoDosagemOptions = tipos);
    debugger
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

  criarItemReceita(){
    debugger
    let itemReceita = new ItemReceita();
    itemReceita.medicamento = new Medicamento();

    this.itensReceita.push(itemReceita);
  }

  adicionarItemReceita(){
    debugger
    let itemReceita = new ItemReceita();
    let ultimoRegistro = this.itensReceita.length-1
    for (let i=0; i<this.itensReceita.length; i++){
      if (ultimoRegistro==i){
        itemReceita = this.itensReceita[i];
      }
    }
    if (itemReceita.dias==null || itemReceita.dias==undefined || itemReceita.frequencia==null || itemReceita.frequencia==undefined
        || itemReceita.medicamento==null || itemReceita.medicamento==undefined || itemReceita.quantidade==null || itemReceita.quantidade==undefined
        || itemReceita.tipoDosagem==null || itemReceita.tipoDosagem==undefined) {

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
          }
          for (let i=0; i<this.itensReceita.length; i++){
            if (i==index){
              this.itensReceita[i].medicamento = medicamentoSelecionado;
            }
          }
      });
    }
  }

  selecionouTipoDosagem(event, typeTipoDosagem, index){
    debugger
    if (typeTipoDosagem!==null && typeTipoDosagem!== undefined){
      this._enumService.recuperarTipoDosagemPorType(typeTipoDosagem).subscribe(
        result => {
          for (let i=0; i<this.itensReceita.length; i++){
            if (i==index){
              this.itensReceita[i].tipoDosagem = result;
            }
          }
        }
      )

    }
  }

  gravarReceita(){
    debugger
    this._receitaService.addReceita(this.idPaciente, this.idProfissoinal, this.itensReceita).subscribe(
      result => {

      }
    );
  }

  gerarReceita() {
    debugger
    this._relatorioService.gerarRelatorio().subscribe(res => {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      let nomeArquivo = 'receitaMedica' + '.pdf';
      link.download = nomeArquivo;
      link.click();
    });
  }
}
