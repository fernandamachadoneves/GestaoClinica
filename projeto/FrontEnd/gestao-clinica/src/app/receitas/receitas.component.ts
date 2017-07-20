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

  constructor(private _enumService: EnumService) { }

  ngOnInit() {
    $('select').material_select();
    this._enumService.getEnum('TipoDosagem').subscribe(tipos => this.tipoDosagemOptions = tipos);
  }

  adicionarReceita(){
    debugger
     $('.modal').modal({
       dismissible: true
    }
    );
  }
}
