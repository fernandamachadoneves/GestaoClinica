import { TestBed, inject } from '@angular/core/testing';

import { ProfissionalListarService } from './profissional-listar.service';

describe('ProfissionalListarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfissionalListarService]
    });
  });

  it('should be created', inject([ProfissionalListarService], (service: ProfissionalListarService) => {
    expect(service).toBeTruthy();
  }));
});
