import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractFileUploaderComponent } from '@misc/abstracts/components/abstract-file-uploader.component';
import { ThemePalette } from '@angular/material/core';
import { FileApiService } from '@services/api/file-api/file-api.service';
import { IServicesConfig } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { ApiFile } from '@models/classes/file.model';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent extends AbstractFileUploaderComponent implements OnInit {
  protected _fileApi: FileApiService = inject(FileApiService);
  @Input() previewHeight: number = 160;
  @Input() previewWidth: number = 225;
  @Input() actionsYPosition: 'start' | 'end' = 'end';
  @Input() actionsXPosition: 'start' | 'end' = 'end';
  @Input() actionsColor: ThemePalette = 'primary';

  get actionsPositionClasses(): string[] {
    return [`file-uploader__file-actions_x-${this.actionsXPosition}`, `file-uploader__file-actions_y-${this.actionsYPosition}`];
  }

  protected override _upload(file: File, servicesConfig: IServicesConfig): Observable<ApiFile> {
    return this._fileApi.uploadMedia(file, servicesConfig);
  }
}
