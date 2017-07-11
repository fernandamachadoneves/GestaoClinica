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
  { path: 'paciente', component: PacienteComponent},
  { path: 'controleAgenda', component: ControleAgendaComponent},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
