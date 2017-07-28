import { PedidoExame } from './../models/PedidoExame';
import { ItemPedidoExame } from './../models/itemPedidoExame';
import { ItemReceita } from './../models/itemReceita';
import { environment } from './../../../environments/environment';
import { Headers, RequestOptions, Response, Http } from '@angular/http';
import { Receita } from './../models/receita';
import { Profissional } from './../models/profissional';
import { Paciente } from './../models/paciente';
import { ConfiguracaoHorarioProfissional } from './../models/configuracaoHorarioProfissional';
import { ProfissionalService } from './../profissional.service';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PedidoExameService {

  private urlAdicionarPedidoExame = environment.context + '/GestaoClinica-web/rest/pedidoExame/adicionar';
  private urlEditarItemPedidoExame = environment.context + '/GestaoClinica-web/rest/pedidoExame/editar';
  private urlEditarItensPedido = environment.context + '/GestaoClinica-web/rest/pedidoExame/editarItens';
  private urlPesquisarPedidos = environment.context + '/GestaoClinica-web/rest/pedidoExame/pesquisarPedidos/:idPaciente';
  private urlRecuperarItensPorIdPedido = environment.context + '/GestaoClinica-web/rest/pedidoExame/recuperarItensPorIdPedidoExame/:idPedidoExame';
  private urlLancarResultadoExame = environment.context + '/GestaoClinica-web/rest/pedidoExame/lancarResultadoExame';
  private urlExcluirItemPedidoExame = environment.context + '/GestaoClinica-web/rest/pedidoExame/excluir';
  private urlRecuperarItemPorId = environment.context + '/GestaoClinica-web/rest/pedidoExame/recuperarItemPedidoExamePorId/:idItemPedido';

  constructor(private http: Http) { }

  addPedidoExame(idPaciente: number, idProfissional: number, itensPedidoExame: Array<ItemPedidoExame>) {
    let jsonPost = { "idPaciente": JSON.stringify(idPaciente),
            "idProfissional": JSON.stringify(idProfissional),
            "itensPedidoExame": JSON.stringify(itensPedidoExame)
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlAdicionarPedidoExame, jsonPost,
      options).map((res: Response) => res);
  }


  update(itemPedidoExame: ItemPedidoExame){
      let jsonPost = { "itemPedidoExame": JSON.stringify(itemPedidoExame)
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.urlEditarItemPedidoExame, jsonPost,
        options).map((res: Response) => res);
  }

  editarItensPedido(itensPedido: Array<ItemPedidoExame>, pedidoExame: PedidoExame){
      let jsonPost = { "itensPedido": JSON.stringify(itensPedido),
                       "pedidoExame": JSON.stringify(pedidoExame)
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.urlEditarItensPedido, jsonPost,
        options).map((res: Response) => res);
  }

  recuperarPedidosPorPaciente(idPaciente: number){
    let headers = new Headers();
    let url = this.urlPesquisarPedidos.replace(':idPaciente', idPaciente.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  recuperarItensPorIdPedidoExame(idPedidoExame: number){
    let headers = new Headers();
    let url = this.urlRecuperarItensPorIdPedido.replace(':idPedidoExame', idPedidoExame.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  recuperarItemPorId(idItemPedido: number){
    let headers = new Headers();
    let url = this.urlRecuperarItemPorId.replace(':idItemPedido', idItemPedido.toString());
    return this.http.get(url)
                    .map(this.extractData);
  }

  lancarResultadoExame(itemPedidoExame: ItemPedidoExame){
      let jsonPost = { "itemPedidoExame": JSON.stringify(itemPedidoExame)
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.urlLancarResultadoExame, jsonPost,
        options).map((res: Response) => res);
  }

  excluirItemPedidoExame(itemPedidoExame: ItemPedidoExame){
      let jsonPost = { "itemPedidoExame": JSON.stringify(itemPedidoExame)
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.urlExcluirItemPedidoExame, jsonPost,
        options).map((res: Response) => res);
  }

  private extractData(res: Response) {
    let body = res.json();

    return body;
  }

}
