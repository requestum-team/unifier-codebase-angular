import { Component, inject, Input } from '@angular/core';
import { LoaderService } from '@services/loader/loader.service';

@Component({
  selector: 'loader-container',
  templateUrl: './loader-container.component.html',
  styleUrls: ['./loader-container.component.scss']
})
export class LoaderContainerComponent {
  private _loader: LoaderService = inject(LoaderService);
  @Input() isLoading: boolean;
  @Input() diameter: number = 100;

  get shouldShowLoader(): boolean {
    return !this._loader.isLoading && this.isLoading;
  }
}
