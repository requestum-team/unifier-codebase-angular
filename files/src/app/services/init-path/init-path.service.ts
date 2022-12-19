import { inject, Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class InitPathService implements OnDestroy {
  private _location: Location = inject(Location);
  private _path: string | null;

  get initialUrl(): string[] {
    const defaultUrl: string[] = [''];

    return this._path && this._path !== '/' ? this._path.split('/') : defaultUrl;
  }

  ngOnDestroy(): void {
    this.clear();
  }

  clear(): void {
    this._path = null;
  }

  update(): void {
    const path: string = this._location.path();

    this._path = !path.includes('/auth/') ? path : null;
  }
}
