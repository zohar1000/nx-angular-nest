import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFormComponent } from '@sample-app/shared/base-classes/base-form.component';
import { FormControl, Validators } from '@angular/forms';
import { UserProfile } from '@shared/models/user-profile.model';
import { EditItemRequestData } from '@shared/models/edit-item-request-data.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserComponent extends BaseFormComponent {
  // user: UserProfile = null;

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

  getEditItemRequestData(formValue): EditItemRequestData {
    const data = { ...formValue };
    this.numberTypeColumns.forEach(key => data[key] = Number(data[key]));
    return { id: this.itemId, data }
  }
}
