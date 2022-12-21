import { Component, Input, TemplateRef } from '@angular/core';
import { AbstractFormFieldComponent } from '@misc/abstracts/components/abstract-form-field.component';
import { IOption } from '@models/interfaces/forms/option.interface';

@Component({
  selector: 'base-select',
  templateUrl: './base-select.component.html',
  styleUrls: ['./base-select.component.scss']
})
export class BaseSelectComponent extends AbstractFormFieldComponent {
  @Input() options: IOption[];
  @Input() multiple: boolean;
  @Input() triggerTemplate: TemplateRef<any>;
  @Input() optionTemplate: TemplateRef<any>;
  @Input() getValue: (item: IOption) => any = item => (item as IOption).value;

  getTitle(item: IOption): string {
    return `${item.label ?? item.value}`;
  }
}
