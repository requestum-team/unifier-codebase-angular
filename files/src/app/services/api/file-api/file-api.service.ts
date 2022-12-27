import { Injectable } from '@angular/core';
import { AbstractApiService } from '@misc/abstracts/services/abstract-api.service';
import { ClassConstructor } from 'class-transformer';
import { IServicesConfig } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { ApiFile } from '@models/classes/file.model';
import { toModel } from '@misc/rxjs-operators/to-model.operator';

@Injectable({
  providedIn: 'root'
})
export class FileApiService extends AbstractApiService<ApiFile> {
  protected readonly _URL_PATH: string = '/api/files';
  protected readonly _MODEL: ClassConstructor<ApiFile> = ApiFile;

  uploadMedia(file: File, servicesConfig?: IServicesConfig): Observable<ApiFile> {
    const body = new FormData();

    body.append('file', file);
    body.append('originalName', file.name);

    return this._http.post(`${this.url}/upload`, body, {}, servicesConfig).pipe(toModel(this._MODEL));
  }
}
