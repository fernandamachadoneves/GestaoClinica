import { HttpModule, JsonpModule } from '@angular/http';

import { ProfissionalService } from './shared/profissional.service';
import { ProfissionalComponent } from './profissional/profissional.component';
import { AppRoutingModule } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MaterializeModule } from 'ng2-materialize';
import { ControleAgendaComponent } from './controle-agenda/controle-agenda.component';
import { PacienteComponent } from './paciente/paciente.component';
import { ProfissionalDetailComponent } from './profissional/profissional-detail/profissional-detail.component';
import { ProfissionalCadastroComponent } from './profissional/profissional-cadastro/profissional-cadastro.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  declarations: [
    AppComponent,
    ControleAgendaComponent,
    PacienteComponent,
    ProfissionalComponent,
    ProfissionalDetailComponent,
    ProfissionalCadastroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterializeModule.forRoot(),
    HttpModule,
    TextMaskModule,
    MyDatePickerModule
  ],
  providers: [ProfissionalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
