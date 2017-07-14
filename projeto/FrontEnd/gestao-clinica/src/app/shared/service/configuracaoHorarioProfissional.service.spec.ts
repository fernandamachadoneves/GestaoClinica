import { TestBed, inject } from '@angular/core/testing';

import { ConfiguracaoHorarioProfissionalService } from './configuracaoHorarioProfissional.service';

describe('ConfiguracaoHorarioProfissionalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfiguracaoHorarioProfissionalService]
    });
  });

  it('should be created', inject([ConfiguracaoHorarioProfissionalService], (service: ConfiguracaoHorarioProfissionalService) => {
    expect(service).toBeTruthy();
  }));
});
