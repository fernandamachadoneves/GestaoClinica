import { ConfiguracaoHorarioProfissional } from './../../shared/models/configuracaoHorarioProfissional';
import { ProfissionalListarService } from './../profissionalListar.service';
import { ProfissionalService } from './../../shared/profissional.service';
import { Profissional } from './../../shared/models/profissional';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profissional-detail',
  templateUrl: './profissional-detail.component.html',
  styleUrls: ['./profissional-detail.component.css']
})
export class ProfissionalDetailComponent implements OnInit {

  private idProfissional: number;
  private subscription: Subscription;
  profissionalSelecionado: Profissional;
  configProfissional: ConfiguracaoHorarioProfissional;
  diasDaSemanaformat: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _profissionalService: ProfissionalService,
              private _profissionalListarService: ProfissionalListarService) { }

  ngOnInit() {
    debugger
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.idProfissional = params['id'];
        debugger
        this._profissionalService.recuperarProfissionalPorId(this.idProfissional).subscribe(
            result => {
                this.profissionalSelecionado = result;
                this.diasDaSemanaformat = '';
                this._profissionalService.recuperarConfigProfissionalPorId(this.profissionalSelecionado.id).subscribe(
                    config => {
                      this.configProfissional = config;
                      this.diasDaSemanaformat = this.configProfissional.diasDaSemana.split(';').join(', ');
                });
        });
      });
  }

  editar() {
    this.router.navigate(['/profissional', this.idProfissional, 'edit']);
  }

  remover() {
    this._profissionalService.remover(this.profissionalSelecionado, this.idProfissional).subscribe(
      result => this._profissionalListarService.incluirProfissional(true)
    );
    this.router.navigate(['/profissional']);
  }

}
