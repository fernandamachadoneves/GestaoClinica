import { TestBed, inject } from '@angular/core/testing';

import { ProfissionalService } from './profissional.service';

describe('ProfissionalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfissionalService]
    });
  });

  it('should be created', inject([ProfissionalService], (service: ProfissionalService) => {
    expect(service).toBeTruthy();
  }));
});
