import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFormComponent } from '@sample-app/shared/base-classes/base-form.component';
import { FormControl, Validators } from '@angular/forms';
import { UserStatus } from '@api-app/routes/auth/enums/user-status.enum';
import { AppText } from '@sample-app/shared/models/app-text.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent extends BaseFormComponent {
  text;

  onTranslyText(data) {
    super.onTranslyText(data);
    this.text = (data.text as AppText).pages.users.addUser;
  }

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
