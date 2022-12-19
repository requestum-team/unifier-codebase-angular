import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.scss']
})
export class ConfirmationEmailComponent implements OnInit {
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly PAGE_KEY: string = 'AUTH';
  heading: string = `${this.PAGE_KEY}.CONFIRMATION_SUCCESS`;
  isError: boolean;

  get subheading(): string {
    return this.isError ? `${this.PAGE_KEY}.TRY_ANOTHER_LINK` : `${this.PAGE_KEY}.GO_TO_APP`;
  }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe(({ emailConfirmationErrorMessage }: Params): void => {
      this.isError = !!emailConfirmationErrorMessage;

      if (emailConfirmationErrorMessage) {
        this.heading = emailConfirmationErrorMessage;
      }
    });
  }
}
