import { inject, Injectable } from '@angular/core';
import { LoaderSpinnerService } from '@services/loader/loader-spinner/loader-spinner.service';
import { LoaderBarService } from '@services/loader/loader-bar/loader-bar.service';

export type LoaderType = 'bar' | 'spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _loaderSpinner: LoaderSpinnerService = inject(LoaderSpinnerService);
  private _loaderBar: LoaderBarService = inject(LoaderBarService);

  get isLoading(): boolean {
    return this._loaderSpinner.isLoading || this._loaderBar.isLoading;
  }

  constructor() {
    this._loaderBar.init();
    this._loaderSpinner.init();
  }

  on(type: LoaderType): void {
    switch (type) {
      case 'bar':
        this._loaderBar.on();
        break;
      case 'spinner':
        this._loaderSpinner.on();
        break;
    }
  }

  off(type: LoaderType): void {
    switch (type) {
      case 'bar':
        this._loaderBar.off();
        break;
      case 'spinner':
        this._loaderSpinner.off();
        break;
    }
  }
}
