import { Component, Input, Output, OnInit, EventEmitter, TemplateRef } from '@angular/core';
import { AbstractFormFieldComponent } from '@misc/abstracts/components/abstract-form-field.component';
import { map, takeUntil, auditTime, filter, pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'base-autocomplete',
  templateUrl: './base-autocomplete.component.html',
  styleUrls: ['./base-autocomplete.component.scss']
})
export class BaseAutocompleteComponent<T> extends AbstractFormFieldComponent implements OnInit {
  @Output() keywordDefined: EventEmitter<string> = new EventEmitter<string>();
  @Output() optionSelected: EventEmitter<T> = new EventEmitter<T>();
  @Input() options: T[];
  @Input() optionTemplate: TemplateRef<any>;
  @Input() paramName: string = 'name';
  @Input() template: TemplateRef<any>;
  @Input() displayWith: (option: T) => string = (option: T): string => {
    return (option as any)?.[this.paramName] ?? option;
  };

  ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(
        startWith(''),
        takeUntil(this._DESTROYED$),
        auditTime(300),
        pairwise(),
        filter(([prev, next]: [string, string]): boolean => prev !== next),
        map(([, next]: [string, string]): string => next)
      )
      .subscribe((query: string | unknown): void => {
        if (typeof query === 'string') {
          this.keywordDefined.emit(query);
        }
      });
  }

  onClear(): void {
    this.formControl.setValue('');
  }
}
