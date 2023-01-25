import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileType } from '@models/enums/file-type.enum';
import { ApiFile } from '@models/classes/file.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractFormFieldComponent } from '@misc/abstracts/components/abstract-form-field.component';
import { Observable, zip } from 'rxjs';
import { AbstractApiService } from '@misc/abstracts/services/abstract-api.service';
import { IServicesConfig } from '@services/http/http.service';
import { runInAnyCase } from '@misc/rxjs-operators/run-in-any-case.operator';
import { catchError } from 'rxjs/operators';
import { HttpServiceError } from '@services/http/http-service-error.class';

@Component({
  template: ''
})
export abstract class AbstractFileUploaderComponent extends AbstractFormFieldComponent implements OnInit {
  protected abstract _fileApi: AbstractApiService<ApiFile>;
  protected _sanitizer: DomSanitizer = inject(DomSanitizer);
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @Output() fileDragover: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
  @Output() fileDragleave: EventEmitter<DragEvent> = new EventEmitter<DragEvent>();
  @Input() override control: FormControl = new FormControl();
  @Input() fileType: FileType[] = [FileType.any];
  @Input() multiple: boolean = true;
  @Input() maxCountFile: number = 10;
  @Input() maxSizeFile: number = 5;
  filesOnLoading: Set<string> = new Set<string>();
  filesWithError: Set<string> = new Set<string>();
  selectFile: ApiFile[] = [];
  fileError: string = '';

  get isFileError(): boolean {
    return (this.control?.invalid && this.control?.touched) || !!this.fileError;
  }

  get fileErrorMessage(): string {
    return this.fileError || this.errorMessage;
  }

  get valueControl(): File | File[] {
    return this.control?.value;
  }

  ngOnInit(): void {
    this.selectFile = this.valueControl ? (this.multiple ? (this.control.value as ApiFile[]) : [this.control.value]) : [];
  }

  getFiles(event: Event): File[] {
    return Array.from((event.target as HTMLInputElement).files ?? []).map((file: File): File => file);
  }

  fileChangeHandler(files: File[]): void {
    const filteredFiles: File[] = files.filter(
      (file: File): boolean =>
        this.fileType.some((ft: FileType): boolean => ft === FileType.any || ft.includes(file.type)) &&
        this.selectFile.every((sFile: ApiFile): boolean => !(sFile.name === file.name))
    );

    if (!this.multiple) {
      this.selectFile.length = 0;

      if (filteredFiles.length > 1) {
        filteredFiles.length = 1;
      }
    }

    this.selectFile.push(...(filteredFiles as any as ApiFile[]));
    this.fileUploadHandler(filteredFiles);
  }

  fileUploadHandler(files: File[]): void {
    zip(
      ...files.map((file: File): Observable<ApiFile> => {
        this.filesOnLoading.add(file.name);
        return this._upload(file, { skipErrorNotification: true }).pipe(
          catchError((error: HttpServiceError): Observable<never> => {
            this.filesWithError.add(file.name);
            throw error;
          }),
          runInAnyCase(() => this.filesOnLoading.delete(file.name))
        );
      })
    ).subscribe((apiFiles: ApiFile[]): void => {
      this.control.setValue(this.multiple ? apiFiles : apiFiles[0]);
    });
  }

  fileValidation(files: File[]): boolean {
    if (files.find((file: File): boolean => this._toMB(file.size) > this.maxSizeFile)?.size) {
      this.fileError = this._translate.instant('FILE_UPLOADER.FILE_SIZE', { size: this.maxSizeFile });
      return false;
    } else {
      this.fileError = '';
    }

    if (this.maxCountFile && this.maxCountFile < files.length) {
      this.fileError = this._translate.instant('FILE_UPLOADER.SELECTED_FILES_MAX', { count: this.maxCountFile });
      return false;
    } else {
      this.fileError = '';
    }

    return true;
  }

  removeFile(idx: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const haveBeenErrored: boolean = Boolean(this.fileError);
    this.filesWithError.delete(this.selectFile?.find?.((file: ApiFile, index: number): boolean => idx === index)?.name as string);
    this.selectFile = (this.selectFile as ApiFile[]).filter((file: ApiFile, index: number): boolean => idx !== index);
    this.control.setValue(
      this.control.value?.length ? this.control.value.filter((file: File, index: number): boolean => idx !== index) : null
    );
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = this.control.value?.length
        ? this.control.value.filter((file: File, index: number): boolean => idx !== index)
        : null;
    }
    if (haveBeenErrored && this.fileValidation(this.selectFile as any as File[])) {
      this.fileUploadHandler(this.selectFile as any as File[]);
    }
  }

  isFileMaxSize(file: ApiFile | File): boolean {
    return this._toMB(file.size) > this.maxSizeFile;
  }

  chooseAnotherFile(): void {
    this.fileInput?.nativeElement.dispatchEvent(new MouseEvent('click'));
  }

  getNativeFileUrl(file: ApiFile | File): string {
    if (file instanceof ApiFile) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(file.uri) as string;
    }

    return this._sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file)) as string;
  }

  protected abstract _upload(file: File, servicesConfig: IServicesConfig): Observable<ApiFile>;

  protected _toMB(size: number): number {
    return size / 1024 ** 2;
  }
}
