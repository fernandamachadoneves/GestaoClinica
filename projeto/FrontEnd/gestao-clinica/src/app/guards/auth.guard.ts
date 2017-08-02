import { AuthService } from './../shared/auth.service';
import { Observable } from 'rxjs/Rx';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean> | boolean {
    if (this._authService.usuarioEstaAutenticado()){
      return true;
    } 
    this._router.navigate(['/login']);
    return false;
  }
}
