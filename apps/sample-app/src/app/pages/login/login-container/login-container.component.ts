import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { BaseContainerComponent } from '../../../shared/base-classes/base-container.component';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ServerResponse } from '@shared/models/server-response.model';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginContainerComponent extends BaseContainerComponent {
  errorMessage$ = new BehaviorSubject<string>('');
  sendToParentEmitter = new EventEmitter();

  constructor(private authService: AuthService) {
    super();
  }

  onSubmit(formValue) {
    this.regSub(this.authService.login(formValue).subscribe((response: ServerResponse) => {
      if (!response.isSuccess) {
        this.errorMessage$.next(this.appText$.value.errors.loginFailed);
      } else {
        this.sendToParentEmitter.emit({ type: 'LoginSuccess' })
      }
    }));
  }
}
