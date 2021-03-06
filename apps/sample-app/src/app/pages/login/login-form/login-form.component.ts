import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent extends BaseComponent {
  @Input() errorMessage$: BehaviorSubject<string>;
  @Output() submitEmitter = new EventEmitter();
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  submit() {
    this.errorMessage$.next('');
    if (this.form.valid) {
      this.submitEmitter.emit(this.form.value);
    } else {
      this.errorMessage$.next(this.appText$.value.errors.loginFailed);
    }
  }
}
