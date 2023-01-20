import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '@services/auth/auth.service';
import { catchError, first, map, pairwise, switchMap, timeout } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private _auth: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _isRevokedChanged$: Observable<boolean> = timer(0, 0).pipe(
    map((): boolean => this._auth.token?.isRevoked),
    pairwise(),
    map(([newTokenState, oldTokenState]: [boolean, boolean]): boolean => oldTokenState !== newTokenState)
  );

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('./')) {
      return next.handle(req);
    }

    return next.handle(this._auth.addTokenToRequest(req)).pipe(
      catchError((error: Error): Observable<HttpEvent<any>> => {
        if (error instanceof HttpErrorResponse && this._shouldHandleUnauthorized(error, req)) {
          return this._updateTokens(req, next);
        } else {
          throw error;
        }
      })
    );
  }

  private _shouldHandleUnauthorized(error: HttpErrorResponse, req: HttpRequest<any>): boolean {
    const isUnauthorizedResponse: boolean = (error as HttpErrorResponse).status === 401;
    const isNotIgnoredPage: boolean = [].every((page: string): boolean => !this._router.url.includes(page));
    const isNotIgnoredEndpoint: boolean = ['/api/token'].every((endpoint: string): boolean => !req.url.includes(endpoint));

    return isUnauthorizedResponse && isNotIgnoredPage && isNotIgnoredEndpoint;
  }

  private _updateTokens(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._auth.token?.isRevoked) {
      this._auth.markTokensAsRevoked();
      return this._fetchToken(req, next);
    } else {
      return this._isRevokedChanged$.pipe(
        first((value: boolean): boolean => value),
        switchMap((): Observable<HttpEvent<any>> => next.handle(this._auth.addTokenToRequest(req))),
        timeout({
          each: 10000,
          with: () => (this._auth.token?.isRevoked ? this._fetchToken(req, next) : of(null))
        })
      );
    }
  }

  private _fetchToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const observable$: Observable<any> = this._auth.token?.refresh ? this._auth.refreshToken() : this._auth.getTemporaryToken();

    return observable$.pipe(
      catchError((error: HttpErrorResponse): never => {
        this._router.navigate(['', 'auth', 'log-in']);
        throw error;
      }),
      switchMap((): Observable<HttpEvent<any>> => {
        return next.handle(this._auth.addTokenToRequest(req));
      })
    );
  }
}
