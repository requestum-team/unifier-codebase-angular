import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { AbstractFormFieldComponent } from '@misc/abstracts/components/abstract-form-field.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Params } from '@angular/router';

@Component({
  selector: 'base-range-datepicker',
  templateUrl: './base-range-datepicker.component.html',
  styleUrls: ['./base-range-datepicker.component.scss']
})
export class BaseRangeDatepickerComponent extends AbstractFormFieldComponent implements OnInit {
  protected _fb: FormBuilder = inject(FormBuilder);
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  range: FormGroup;

  ngOnInit(): void {
    this.range = this._fb.group({
      start: this._fb.control(''),
      end: this._fb.control('')
    });

    this.range.valueChanges
      .pipe(
        takeUntil(this._DESTROYED$),
        filter(({ start, end }: Params): boolean => Boolean(start && end))
      )
      .subscribe(({ start, end }: Params): void => {
        if (this.control) {
          this.control.setValue(`${start.toISOString()} <=> ${end.toISOString()}`);
        }
      });
  }
}
