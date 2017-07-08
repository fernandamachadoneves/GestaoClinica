import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleAgendaComponent } from './controle-agenda.component';

describe('ControleAgendaComponent', () => {
  let component: ControleAgendaComponent;
  let fixture: ComponentFixture<ControleAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControleAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
