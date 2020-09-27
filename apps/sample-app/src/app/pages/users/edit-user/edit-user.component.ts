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
  user: UserProfile = null;

  setFormGroup() {
    this.user = this.item as UserProfile;
    this.formGroup = this.formBuilder.group({
      firstName: new FormControl(this.user.firstName, this.getNameValidators()),
      lastName: new FormControl(this.user.lastName, this.getNameValidators()),
      role: new FormControl(this.user.role, [Validators.required]),
      status: new FormControl(String(this.user.status), Validators.required),
      email: new FormControl(this.user.email, this.getEmailValidators()),
      password: new FormControl('', this.getPasswordValidators(false))
    });
  }

  getEditItemRequestData(): EditItemRequestData {
    return { id: this.user.id, data: {} }
  }



  // onClickSubmit() {
  //   this.submit.emit({ id: 102, data: { id: 102}});
  // }
}
