import { CookieService } from 'angular2-cookie/core';
import { ProfissionalService } from './../shared/profissional.service';
import { Profissional } from './../shared/models/profissional';
import { AuthService } from './../shared/auth.service';
import { Observable } from 'rxjs/Rx';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class MedicoGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _profissional: ProfissionalService,
    private _cookie: CookieService
  ) { }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> | boolean {
    debugger
    if (this._authService.usuarioEstaAutenticado()){
      this._authService.mostrarMenuEmitter.emit(true);
      if (this._cookie.get('perfil') == 'MEDICO'){
        this._profissional.recuperarProfissionalPorEmail(this._cookie.get('login')).subscribe(
          result => {
            this._cookie.put('idProfissional', result.id);
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
