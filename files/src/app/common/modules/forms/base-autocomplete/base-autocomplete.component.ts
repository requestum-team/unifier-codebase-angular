import { Component, Input, Output, OnInit, EventEmitter, TemplateRef } from '@angular/core';
import { AbstractFormFieldComponent } from '@misc/abstracts/abstract-form-field.component';
import { map, takeUntil, auditTime, filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'base-autocomplete',
  templateUrl: './base-autocomplete.component.html',
  styleUrls: ['./base-autocomplete.component.scss']
})
export class BaseAutocompleteComponent extends AbstractFormFieldComponent implements OnInit {
  @Output() keywordDefined: EventEmitter<string> = new EventEmitter<string>();
  @Input() options: any[];
  @Input() optionTemplate: TemplateRef<any>;
  @Input() paramName: string = 'name';
  @Input() template: TemplateRef<any>;
  @Input() displayWith: (option: any) => any = (option: any): string => {
    return option?.[this.paramName] ?? option;
  };

  ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(
        takeUntil(this._DESTROYED$),
        auditTime(300),
        pairwise(),
        filter(([prev, next]: [string, string]): boolean => prev !== next),
        map(([, next]: [string, string]): string => next)
      )
      .subscribe((query: string): void => {
        this.keywordDefined.emit(query);
      });
  }

  onClear(): void {
    this.formControl.setValue('');
  }
}
