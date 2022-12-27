import { Injectable } from '@angular/core';
import { AbstractLoaderService } from '@misc/abstracts/services/abstract-loader.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ComponentType, OverlayConfig } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class LoaderBarService extends AbstractLoaderService<MatProgressBar> {
  protected _attachedComponent: ComponentType<MatProgressBar> = MatProgressBar;
  protected _overlayConfig: OverlayConfig = {
    hasBackdrop: false,
    disposeOnNavigation: false,
    positionStrategy: this._overlay.position().global().centerHorizontally().top()
  };
}
