import { Component } from '@angular/core';
import { AbstractAppComponent } from '@misc/abstracts/components/abstract-app.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractAppComponent {}
