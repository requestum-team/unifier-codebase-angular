import { Injectable } from '@angular/core';
import { AbstractLoaderService } from '@misc/abstracts/services/abstract-loader.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ComponentType, OverlayConfig } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class LoaderSpinnerService extends AbstractLoaderService<MatProgressSpinner> {
  protected _attachedComponent: ComponentType<MatProgressSpinner> = MatProgressSpinner;
  protected _overlayConfig: OverlayConfig = {
    hasBackdrop: true,
    disposeOnNavigation: false,
    positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically()
  };
}
