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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _profissionalService: ProfissionalService) { }

  ngOnInit() {
    debugger
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.idProfissional = params['id'];
        debugger
        this._profissionalService.recuperarProfissionalPorId(this.idProfissional).subscribe(
            result => {
                this.profissionalSelecionado = result;
        });
      });
  }

  editar() {
    this.router.navigate(['/profissional', this.idProfissional, 'edit']);
  }

  remover() {
    debugger
    this._profissionalService.remover(this.profissionalSelecionado, this.idProfissional).subscribe();
  }

}
