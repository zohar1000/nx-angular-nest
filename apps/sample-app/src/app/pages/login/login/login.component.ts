import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseContainerComponent } from '../../../shared/classes/base-container.component';

@Component({
  selector: 'nx-angular-nest-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseContainerComponent {
  // @Input() error: string | null;
  // @Output() submitEM = new EventEmitter();
  error = '';

  form: FormGroup = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  });

  submit() {
    this.error = '';
    if (this.form.valid) {
      console.log('form is ok');
      // this.submitEM.emit(this.form.value);
console.log('form value:', this.form.value);
      this.apiService.post('auth/login', this.form.value).subscribe(response => {
        console.log('login resp:', response);
      })
    } else {
      this.error = 'incorrect user/password';
    }
  }
}
