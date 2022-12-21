import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { AbstractFormFieldComponent } from '@misc/abstracts/components/abstract-form-field.component';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'base-datepicker',
  templateUrl: './base-datepicker.component.html',
  styleUrls: ['./base-datepicker.component.scss']
})
export class BaseDatepickerComponent extends AbstractFormFieldComponent {
  @Input() startDate: Date = new Date();
  @Input() minDate: Date | string | number | undefined;
  @Input() maxDate: Date | string | number | undefined;
  @Input() startViewMode: 'month' | 'year' | 'multi-year' = 'multi-year';
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @ViewChild('dp3') datePicker: MatDatepicker<Date | string | number>;

  handleDateChange(event: MatDatepickerInputEvent<unknown>): void {
    this.dateChange.emit(event.value as Date);
  }

  onLabelClicked(): void {
    this.datePicker?.open();
  }
}
