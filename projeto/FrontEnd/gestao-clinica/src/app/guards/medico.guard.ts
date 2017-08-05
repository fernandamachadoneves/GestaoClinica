import { ProfissionalService } from './../shared/profissional.service';
import { Profissional } from './../shared/models/profissional';
import { AuthService } from './../shared/auth.service';
import { Observable } from 'rxjs/Rx';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class MedicoGuard implements CanActivate {

  profissional = new Profissional();

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _profissional: ProfissionalService
  ) { }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> | boolean {
    debugger
    if (this._authService.usuarioEstaAutenticado()){
      if (this._authService.usuarioLogado.perfil.type == 'MEDICO'){
        this._profissional.recuperarProfissionalPorEmail(this._authService.usuarioLogado.login).subscribe(
          result => {
            this.profissional = result;
          }
        )
        return true;
      } else {
        this._router.navigate(['/semPermissao']);
        return false;
      }
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
