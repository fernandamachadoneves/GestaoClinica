import { GestaoClinicaPage } from './app.po';

describe('gestao-clinica App', () => {
  let page: GestaoClinicaPage;

  beforeEach(() => {
    page = new GestaoClinicaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
