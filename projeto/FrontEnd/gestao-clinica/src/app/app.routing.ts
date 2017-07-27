import { MedicamentoDetailComponent } from './medicamentos/medicamento-detail/medicamento-detail.component';
import { MedicamentoCadastroComponent } from './medicamentos/medicamento-cadastro/medicamento-cadastro.component';
import { MedicamentosComponent } from './medicamentos/medicamentos.component';
import { ExamesComponent } from './exames/exames.component';
import { ReceitasComponent } from './receitas/receitas.component';
import { ProntuarioComponent } from './prontuario/prontuario.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { PacienteDetailComponent } from './paciente/paciente-detail/paciente-detail.component';
import { PacienteCadastroComponent } from './paciente/paciente-cadastro/paciente-cadastro.component';
import { AgendaPacienteComponent } from './controle-agenda/agenda-paciente/agenda-paciente.component';
import { AgendaProfissionalComponent } from './controle-agenda/agenda-profissional/agenda-profissional.component';
import { ProfissionalCadastroComponent } from './profissional/profissional-cadastro/profissional-cadastro.component';
import { ProfissionalDetailComponent } from './profissional/profissional-detail/profissional-detail.component';
import { PacienteComponent } from './paciente/paciente.component';
import { ControleAgendaComponent } from './controle-agenda/controle-agenda.component';
import { ProfissionalComponent } from './profissional/profissional.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'profissional', component: ProfissionalComponent,
    children: [
      { path: 'novo', component: ProfissionalCadastroComponent },
      { path: ':id', component: ProfissionalDetailComponent },
      { path: ':id/edit', component: ProfissionalCadastroComponent }
  ]},
  { path: 'paciente', component: PacienteComponent,
  children: [
      { path: 'novo', component: PacienteCadastroComponent },
      { path: ':id', component: PacienteDetailComponent },
      { path: ':id/edit', component: PacienteCadastroComponent }
  ]},
  { path: 'medicamento', component: MedicamentosComponent,
    children: [
      { path: 'novo', component: MedicamentoCadastroComponent },
      { path: ':id', component: MedicamentoDetailComponent },
      { path: ':id/edit', component: MedicamentoCadastroComponent }
  ]},
  { path: 'controleAgenda', component: ControleAgendaComponent,
    children: [
      { path: 'agendaProfissinal', component: AgendaProfissionalComponent},
      { path: 'agendaPaciente', component: AgendaPacienteComponent}
    ]},
  { path: 'atendimento', component: AtendimentoComponent
  },
  { path: 'prontuario/:id', component: ProntuarioComponent,
    children: [
    { path: 'receita/:id', component: ReceitasComponent},
    { path: 'exame/:id', component: ExamesComponent}
  ]},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
