import { Component, Input, ViewChild } from '@angular/core';
import { AbstractFormFieldComponent } from '@misc/abstracts/abstract-form-field.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'base-textarea',
  templateUrl: './base-textarea.component.html',
  styleUrls: ['./base-textarea.component.scss']
})
export class BaseTextareaComponent extends AbstractFormFieldComponent {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input() minRows: number = 8;
  @Input() maxRows: number = 12;
}
