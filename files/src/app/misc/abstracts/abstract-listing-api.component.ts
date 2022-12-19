import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { HttpServiceError } from '@services/http/http-service-error.class';
import { AbstractCrudHelpersComponent } from '@misc/abstracts/abstract-crud-helpers.component';
import { List } from '@models/classes/_list.model';
import { DATE_FORMAT } from '@misc/constants/_base.constant';
import { IDateRange, QueryParamsService } from '@services/query-params/query-params.service';

@Component({
  template: '',
  providers: [QueryParamsService]
})
export abstract class AbstractListingApiComponent<T = any> extends AbstractCrudHelpersComponent<T> implements OnInit, OnDestroy {
  isLoading: boolean = false;
  protected _queryParams: QueryParamsService = inject(QueryParamsService);
  protected _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly BASE_DATE_FORMAT: string = DATE_FORMAT.FULL;
  abstract list: List<T>;

  get params(): Params {
    return this._queryParams.params;
  }

  constructor() {
    super();
    this._queryParams.shouldTranslateParamsToURL = false;
  }

  ngOnInit(): void {
    merge(this._queryParams.params$, this._activatedRoute.params)
      .pipe(
        takeUntil(this._DESTROYED$),
        switchMap((): Observable<List> => this._loadItems(this.params))
      )
      .subscribe();
  }

  onFilter(fieldName: string, value: unknown, type: 'search' | 'date-range'): void {
    switch (type) {
      case 'search':
        this._queryParams.searchQuery((value as string)?.trim?.(), fieldName);
        break;
      case 'date-range':
        this._queryParams.addRange(fieldName, value as IDateRange);
        break;
    }

    this._queryParams.paginate(1, this._queryParams.params[QueryParamsService.BASE_KEYS.PER_PAGE]);
  }

  protected _updateList(shouldClearPagination: boolean): void {
    if (shouldClearPagination) {
      this._queryParams.paginate(1, this._queryParams.params[QueryParamsService.BASE_KEYS.PER_PAGE]);
    } else {
      this._loadItems(this.params).subscribe();
    }
  }

  protected _loadItems(params: Params): Observable<List<T>> {
    this.isLoading = true;

    return this._getItems(params).pipe(
      takeUntil(this._DESTROYED$),
      catchError((err: HttpServiceError): Observable<never> => {
        this.list = { entities: [], total: 0 };
        this.isLoading = false;
        throw err;
      }),
      tap((list: List<T>): void => {
        this.list = list;
        this.isLoading = false;
      })
    );
  }

  protected abstract _getItems(params: Params): Observable<List<T>>;
}
