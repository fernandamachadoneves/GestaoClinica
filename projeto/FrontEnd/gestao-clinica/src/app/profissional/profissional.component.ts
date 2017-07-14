import { ProfissionalListarService } from './profissionalListar.service';
import { Profissional } from './../shared/models/profissional';
import { ProfissionalService } from './../shared/profissional.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.css']
})
export class ProfissionalComponent implements OnInit {

  profissionais = new Array<Profissional>();
  profissionalPesquisa: string;

  constructor(private _profissionalService: ProfissionalService) { }

  ngOnInit() {
    this._profissionalService.getProfissionais().subscribe(
      profissional => {
        this.profissionais = profissional;
      }
    );
    ProfissionalListarService.incluiuProfissional.subscribe(
      profNovo => {
        if (profNovo){
            this._profissionalService.getProfissionais().subscribe(
                profissional => {
                  this.profissionais = profissional;
            }
          );
        }
      }
      
    );
  }

  pesquisar(){
    if (this.profissionalPesquisa != ''){
      this._profissionalService.recuperarProfissionalPorNome(this.profissionalPesquisa).subscribe(
        profissional => {
          this.profissionais = profissional;
        }
      );
    } else {
      this._profissionalService.getProfissionais().subscribe(
        profissional => {
          this.profissionais = profissional;
        }
      );
    }
  }
}
