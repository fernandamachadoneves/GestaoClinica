import { element } from 'protractor';
import { ItemPedidoExame } from './../models/itemPedidoExame';
import { Paciente } from './../models/paciente';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class RelatorioService {

  private urlGerarReceita = environment.context + '/GestaoClinica-web/rest/relatorio/gerarReceitaMedica/:idReceita';

  private urlGerarRelatorioResultadoExame = environment.context + '/GestaoClinica-web/rest/relatorio/gerarResultadoExame/:idItemPedidoExame';

  private urlGerarPedidoExame = environment.context + '/GestaoClinica-web/rest/relatorio/gerarPedidoExame/';

  constructor(private http: Http) { }

  gerarRelatorio(idReceita: number) {
    debugger
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = this.urlGerarReceita.replace(':idReceita', idReceita.toString());

    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob});
    return this.http.get(url, options)
      .map((res) => {
        return new Blob([res.blob()], { type: 'application/pdf'})
      });
  }

  gerarRelatorioResultadoExame(idItemPedidoExame: number) {
    debugger
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = this.urlGerarRelatorioResultadoExame.replace(':idItemPedidoExame', idItemPedidoExame.toString());

    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob});
    return this.http.get(url, options)
      .map((res) => {
        return new Blob([res.blob()], { type: 'application/pdf'})
      });
  }

  gerarPedidoExame(listaPedidos: Array<ItemPedidoExame>, idPaciente: number, idProfissionalLogado: string) {

      let jsonPost = { "listaPedidos": JSON.stringify(listaPedidos),
              "idPaciente": JSON.stringify(idPaciente),
              "idProfissionalLogado": JSON.stringify(idProfissionalLogado),
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob});
      return this.http.post(this.urlGerarPedidoExame, jsonPost, options)
        .map((res) => {
        return new Blob([res.blob()], { type: 'application/pdf'})
      });
  }


  private extractData(res: Response) {
    let body = res.json();

    return body;
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
