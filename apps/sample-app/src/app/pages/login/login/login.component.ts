import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'nx-angular-nest-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // @Input() error: string | null;
  // @Output() submitEM = new EventEmitter();
  error = '';

  form: FormGroup = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    this.error = '';
    if (this.form.valid) {
      console.log('form is ok');
      // this.submitEM.emit(this.form.value);
    } else {
      this.error = 'incorrect user/password';
    }
  }
}
