import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserStatusLabels } from '../consts/user-status.const';
import { BaseComponent } from './base.component';
import { appInjector } from '../../app.injector';
import { FormPatterns } from '@shared/enums/form-patterns.enum';
import { RoleLabels } from '@shared/consts/role.const';
import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { EditItemRequestData } from '@shared/models/edit-item-request-data.model';

@Directive()
export abstract class BaseFormComponent extends BaseComponent implements OnInit {
  @Input() currItem$;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  formGroup: FormGroup;
  protected formBuilder: FormBuilder;
  protected item;
  rolesLabels = RoleLabels;
  userStatusLabels = UserStatusLabels;

  ngOnInit() {
    this.formBuilder = appInjector.get(FormBuilder);
    this.regSub(this.currItem$
      .pipe(
        filter(item => Boolean(item)),
        take(1)
      )
      .subscribe(item => {
      this.item = item;
      this.setFormGroup();
    }));
  }

  abstract setFormGroup();
  abstract getEditItemRequestData(): EditItemRequestData;

  onClickCancel() {
    this.onCancel.emit();
  }

  onClickSubmit() {
    const errorMessage = this.checkFormValidity();
    if (errorMessage) {
      this.showErrorToastr(errorMessage);
    } else {
      this.onSubmit.emit(this.getEditItemRequestData());
    }
  }

  checkFormValidity() {
    return 'Not valid';
  }

  getEmailValidators() {
    return [
      Validators.pattern(FormPatterns.Email),
      Validators.maxLength(30),
      Validators.required
    ];
  }

  getNameValidators() {
    return [
      Validators.required,
      Validators.pattern(FormPatterns.Name),
      Validators.minLength(2),
      Validators.maxLength(20),
    ];
  }

  getPasswordValidators(isRequired = true) {
    const validators = [
      Validators.pattern(FormPatterns.Password),
      Validators.minLength(6),
      Validators.maxLength(30),
    ];
    if (isRequired) validators.push(Validators.required);
    return validators;
  }

  markPristineFields() {
    if (this.formGroup.pristine) {
      for (const key in this.formGroup.value) {
        if (!this.formGroup.value[key]) this.formGroup.controls[key].markAsTouched();
      }
    }
  }

  onSuccessSubmitForm(toastrMessage = '', navigateTo = '') {
    if (toastrMessage) this.toastrService.success(toastrMessage);
    if (navigateTo) this.router.navigate([navigateTo]);
  }
}
