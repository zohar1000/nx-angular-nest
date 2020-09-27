import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStatusLabels } from '../consts/user-status.const';
import { BaseComponent } from './base.component';
import { appInjector } from '../../app.injector';
import { FormPatterns } from '@shared/enums/form-patterns.enum';
import { RoleLabels } from '@shared/consts/role.const';
import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { EditItemRequestData } from '@shared/models/edit-item-request-data.model';
import { ZObj } from 'zshared';
import { AppText } from '@sample-app/shared/consts/app-texts.const';

@Directive()
export abstract class BaseFormComponent extends BaseComponent implements OnInit {
  @Input() currItem$;
  @Input() numberTypeColumns: string[];
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  formGroup: FormGroup;
  protected formBuilder: FormBuilder;
  protected item;
  rolesLabels = RoleLabels;
  userStatusLabels = UserStatusLabels;
  initialFormValue;
  itemId: number | string;

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
      this.initialFormValue = this.formGroup.value;
    }));
  }

  abstract setFormGroup();
  abstract getEditItemRequestData(formValue): EditItemRequestData;

  onClickCancel() {
    this.onCancel.emit();
  }

  onClickSubmit() {
    const formValue = this.formGroup.value;
    const errorMessage = this.checkFormValidity(formValue);
    if (errorMessage) {
      this.showErrorToastr(errorMessage);
    } else {
      this.onSubmit.emit(this.getEditItemRequestData(formValue));
    }
  }

  checkFormValidity(formValue) {
    return ZObj.areEquals(formValue, this.initialFormValue) ? AppText.errors.editFormNotChanged : '';
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
