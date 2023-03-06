import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  UrlTree,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private _router: Router, private authService: AuthService) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.getUser().pipe(
      map((res) => {
        this.authService.setUser(res.body);
        return true;
      }),
      catchError(() => {
        this._router.navigate(['/account/login']);
        return of(false);
      })
    );
  }

  canActivate(): Observable<any> {
    return this.authService.getUser().pipe(
      map((res) => {
        this.authService.setUser(res.body);
        return true;
      }),
      catchError(() => {
        this._router.navigate(['/account/login']);
        return of(false);
      })
    );
  }
}
