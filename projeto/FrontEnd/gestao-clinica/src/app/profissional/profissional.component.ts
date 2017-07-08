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

  constructor(private _profissionalService: ProfissionalService) { }

  ngOnInit() {
    debugger
    this._profissionalService.getProfissionais().subscribe(
      profissional => {
        this.profissionais = profissional;
      }

    );
  }

}
