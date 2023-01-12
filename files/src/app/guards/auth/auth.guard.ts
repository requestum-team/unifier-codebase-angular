import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch, CanActivate {
  constructor(private _router: Router, private _authService: AuthService) {}

  canMatch(route: Route): boolean {
    return this._isAuthenticated();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this._isAuthenticated();
  }

  private _isAuthenticated(): boolean {
    if (this._authService.isAuthenticated) {
      return true;
    }

    this._router.navigate(['', 'auth', 'log-in']);
    return false;
  }
}
