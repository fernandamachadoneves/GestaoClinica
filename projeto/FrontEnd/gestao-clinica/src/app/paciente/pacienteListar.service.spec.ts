import { TestBed, inject } from '@angular/core/testing';

import { PacienteListarService } from './paciente-listar.service';

describe('PacienteListarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PacienteListarService]
    });
  });

  it('should be created', inject([PacienteListarService], (service: PacienteListarService) => {
    expect(service).toBeTruthy();
  }));
});
