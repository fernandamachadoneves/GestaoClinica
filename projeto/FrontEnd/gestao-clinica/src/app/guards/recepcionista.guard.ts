import { AuthService } from './../shared/auth.service';
import { Observable } from 'rxjs/Rx';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class RecepcionistaGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> | boolean {
    debugger
    if (this._authService.usuarioEstaAutenticado()){
      if (this._authService.usuarioLogado.perfil.type == 'RECEPCIONISTA'){
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
