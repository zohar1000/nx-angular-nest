import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { BaseFormComponent } from '@sample-app/shared/base-classes/base-form.component';
import { FormControl, Validators } from '@angular/forms';
import { UserStatus } from '@api-app/routes/auth/enums/user-status.enum';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent extends BaseFormComponent {
  setFormGroup() {
    this.formGroup = this.formBuilder.group({
      firstName: new FormControl('', this.getNameValidators()),
      lastName: new FormControl('', this.getNameValidators()),
      role: new FormControl('', [Validators.required]),
      status: new FormControl(UserStatus.Active, Validators.required),
      email: new FormControl('', this.getEmailValidators()),
      password: new FormControl('', this.getPasswordValidators(false))
    });
  }

  getSubmitItemRequestData(formValue) {
    return this.getSubmitFormValue(formValue);
  }
}
