import { PacienteService } from './shared/service/paciente.service';
import { PacienteListarService } from './paciente/pacienteListar.service';
import { ConfiguracaoHorarioProfissionalService } from './shared/service/configuracaoHorarioProfissional.service';
import { ProfissionalListarService } from './profissional/profissionalListar.service';
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
import { AgendaProfissionalComponent } from './controle-agenda/agenda-profissional/agenda-profissional.component';
import { AgendaPacienteComponent } from './controle-agenda/agenda-paciente/agenda-paciente.component';
import { MaterializeDirective } from 'angular2-materialize';
import { CalendarioComponent } from './shared/components/calendario/calendario.component';
import { PacienteCadastroComponent } from './paciente/paciente-cadastro/paciente-cadastro.component';
import { PacienteDetailComponent } from './paciente/paciente-detail/paciente-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ControleAgendaComponent,
    PacienteComponent,
    ProfissionalComponent,
    ProfissionalDetailComponent,
    ProfissionalCadastroComponent,
    AgendaProfissionalComponent,
    AgendaPacienteComponent,
    MaterializeDirective,
    CalendarioComponent,
    PacienteCadastroComponent,
    PacienteDetailComponent
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
  providers: [
    ProfissionalService, 
    ProfissionalListarService,
    ConfiguracaoHorarioProfissionalService,
    PacienteListarService,
    PacienteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
