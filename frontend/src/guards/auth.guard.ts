import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  UrlTree,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private messageService: MessageService, private _router: Router, private authService: AuthService) { }

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
        if (this.authService.user._id == '0') {
          this._router.navigate(['/dashboard/plants/list']);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'You must set an active plant. If you are a plant manager, please create a plant.',

          });
          

          return false;
        }

        return true;
      }),
      catchError(() => {
        this._router.navigate(['/account/login']);
        return of(false);
      })
    );
  }
}
