import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ServerResponse } from '@shared/models/server-response.model';
import { LocalStrategyResponse } from '@shared/models/local-strategy-response.model';
import { BaseContainerComponent } from '../../../shared/classes/base-container.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginContainerComponent extends BaseContainerComponent {
  errorMessage$ = new BehaviorSubject<string>('');

  constructor(private authService: AuthService, private router: Router) {
    super();
  }

  onSubmit(formValue) {
    this.authService.login(formValue).subscribe(isSucess => {
      if (!isSucess) {
        this.errorMessage$.next('incorrect user/password');
      } else {
        this.router.navigate(['/user']);
      }
    })
  }
}
