import { inject, Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpServiceError } from '@services/http/http-service-error.class';
import { AbstractModel } from '@models/classes/_base.model';
import { AbstractApiBaseService } from '@misc/abstracts/resolvers/abstract-api-base.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractDetailsInfoResolver<Model extends AbstractModel> implements Resolve<Model> {
  private _router: Router = inject(Router);
  protected abstract readonly _PARAM_NAME: string;
  protected abstract _api: AbstractApiBaseService<Model>;

  resolve({ params }: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Model> {
    return this._api.getItem(params[this._PARAM_NAME]).pipe(
      catchError((err: HttpServiceError): Observable<never> => {
        if (err.status === 404) {
          this._router.navigate(['', '404']);
        }

        throw err;
      })
    );
  }
}
