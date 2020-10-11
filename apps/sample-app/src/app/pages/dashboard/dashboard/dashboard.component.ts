import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends BaseComponent {}
