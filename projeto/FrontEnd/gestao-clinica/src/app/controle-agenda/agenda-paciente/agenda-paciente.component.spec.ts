import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPacienteComponent } from './agenda-paciente.component';

describe('AgendaPacienteComponent', () => {
  let component: AgendaPacienteComponent;
  let fixture: ComponentFixture<AgendaPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
