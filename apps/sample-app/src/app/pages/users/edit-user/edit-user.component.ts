import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFormComponent } from '@sample-app/shared/base-classes/base-form.component';
import { FormControl, Validators } from '@angular/forms';
import { UserProfile } from '@shared/models/user-profile.model';
import { ZObj } from 'zshared';
import { AppText } from '@sample-app/shared/consts/app-texts.const';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserComponent extends BaseFormComponent {
  checkFormValidity(formValue) {
    return ZObj.areEquals(formValue, this.initialFormValue) ? AppText.errors.editFormNotChanged : '';
  }

  setFormGroup() {
    const user: UserProfile = this.item as UserProfile;
    this.itemId = user.id;
    this.formGroup = this.formBuilder.group({
      firstName: new FormControl(user.firstName, this.getNameValidators()),
      lastName: new FormControl(user.lastName, this.getNameValidators()),
      role: new FormControl(user.role, [Validators.required]),
      status: new FormControl(String(user.status), Validators.required),
      email: new FormControl(user.email, this.getEmailValidators()),
      password: new FormControl('', this.getPasswordValidators(false))
    });
  }

  getSubmitItemRequestData(formValue) {
    return { id: this.itemId, data: this.getSubmitFormValue(formValue) }
  }
}
