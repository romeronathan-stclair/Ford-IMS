import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthNoGuard implements CanActivate {
  constructor(private _router: Router, private authService: AuthService) { }

  canActivate(): Observable<any> {
    return this.authService.getUser().pipe(
      map((r) => {
        console.log('AuthNoGuard: SUCCESS: map: r: ', r);
        this._router.navigate(['/dashboard']);
        return false;
      }),
      catchError((r) => {
        console.log('AuthNoGuard: FAILURE: map: r: ', r);
        return of(true);
      })
    );
  }
}
