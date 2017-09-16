import { RecepcionistaGuard } from './guards/recepcionista.guard';
import { AdmGuard } from './guards/adm.guard';
import { SemPermissaoComponent } from './sem-permissao/sem-permissao.component';
import { MedicoGuard } from './guards/medico.guard';
import { UsuarioDetailComponent } from './usuario/usuario-detail/usuario-detail.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
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
import { ProfissionalComponent } from './profissional/profissional.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard]}, 
  { path: 'login', component: LoginComponent},
  { path: 'semPermissao', component: SemPermissaoComponent}, 
  { path: 'usuario', component: UsuarioComponent, canActivate: [AdmGuard]},
  { path: 'usuario/novo', component: UsuarioDetailComponent, canActivate: [AdmGuard]},
  { path: 'usuario/:id', component: UsuarioDetailComponent, canActivate: [AdmGuard]},
  { path: 'profissional', component: ProfissionalComponent, canActivate: [AdmGuard]},
  { path: 'profissional/novo', component: ProfissionalCadastroComponent, canActivate: [AdmGuard]},
  { path: 'profissional/:id', component: ProfissionalDetailComponent, canActivate: [AdmGuard]},
  { path: 'profissional/:id/edit', component: ProfissionalCadastroComponent, canActivate: [AdmGuard]},
  { path: 'paciente', component: PacienteComponent, canActivate: [AdmGuard]},
  { path: 'paciente/novo', component: PacienteCadastroComponent, canActivate: [AdmGuard]},
  { path: 'paciente/:id', component: PacienteDetailComponent, canActivate: [AdmGuard]},
  { path: 'paciente/:id/edit', component: PacienteCadastroComponent, canActivate: [AdmGuard]},
  { path: 'medicamento', component: MedicamentosComponent, canActivate: [AdmGuard]},
  { path: 'medicamento/novo', component: MedicamentoCadastroComponent, canActivate: [AdmGuard]},
  { path: 'medicamento/:id', component: MedicamentoDetailComponent, canActivate: [AdmGuard]},
  { path: 'medicamento/:id/edit', component: MedicamentoCadastroComponent, canActivate: [AdmGuard]},
  { path: 'agendaProfissinal', component: AgendaProfissionalComponent,
    canActivate: [RecepcionistaGuard]
  },
  { path: 'agendaPaciente', component: AgendaPacienteComponent,
    canActivate: [RecepcionistaGuard]
  },
  { path: 'atendimento', component: AtendimentoComponent,
    canActivate: [MedicoGuard],
  },
  { path: 'prontuario/:id', component: ProntuarioComponent,
    canActivate: [MedicoGuard],
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
