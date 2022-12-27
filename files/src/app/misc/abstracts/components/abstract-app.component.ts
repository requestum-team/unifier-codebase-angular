import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';
import { SafeResourceUrlWithIconOptions } from '@angular/material/icon';
import { isPlatformServer } from '@angular/common';
import { InitPathService } from '@services/init-path/init-path.service';

@Component({
  template: ''
})
export abstract class AbstractAppComponent {
  private _iconRegistry: MatIconRegistry = inject(MatIconRegistry);
  private _sanitizer: DomSanitizer = inject(DomSanitizer);
  private _initPath: InitPathService = inject(InitPathService);
  private _platformId: object = inject<object>(PLATFORM_ID);
  private _config: IAppConfig = inject<IAppConfig>(APP_CONFIG);

  constructor() {
    this._initPath.update();
    this._iconRegistry.addSvgIconResolver((name: string, namespace: string): SafeResourceUrl | SafeResourceUrlWithIconOptions | null => {
      const path: string = `assets/img/svg/${namespace ? `${namespace}/` : ''}${name}.svg`;

      return this._sanitizer.bypassSecurityTrustResourceUrl(
        isPlatformServer(this._platformId) ? `${this._config.originUrl}/${path}` : `./${path}`
      );
    });
  }
}
