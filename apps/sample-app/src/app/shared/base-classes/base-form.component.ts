import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStatusLabels } from '../consts/user-status.const';
import { BaseComponent } from './base.component';
import { appInjector } from '../../app.injector';
import { FormPatterns } from '@shared/enums/form-patterns.enum';
import { RoleLabels } from '@shared/consts/role.const';
import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { PageType } from '@sample-app/shared/enums/page-type.enum';

@Directive()
export abstract class BaseFormComponent extends BaseComponent implements OnInit {
  @Input() currItem$;
  @Input() numberTypeColumns: string[];
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  formGroup: FormGroup;
  protected formBuilder: FormBuilder = appInjector.get(FormBuilder);
  protected item;
  rolesLabels = RoleLabels;
  userStatusLabels = UserStatusLabels;
  initialFormValue;
  itemId: number | string;
  pageType: PageType;

  abstract setFormGroup();
  abstract getSubmitItemRequestData(formValue);

  ngOnInit() {
    this.pageType = this.currItem$ ? PageType.EditItem : PageType.AddItem;
    switch(this.pageType) {
      case PageType.AddItem:
        this.setFormGroup();
        break;
      case PageType.EditItem:
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
        break;
    }
  }

  onClickCancel() {
    this.onCancel.emit();
  }

  onClickSubmit() {
    const formValue = this.formGroup.value;
    if (this.pageType === PageType.EditItem) {
      const errorMessage = this.checkFormValidity(formValue);
      if (errorMessage) {
        this.showErrorToastr(errorMessage);
        return;
      }
    }
    this.onSubmit.emit(this.getSubmitItemRequestData(formValue));
  }

  checkFormValidity(formValue) {
    return 'PLEASE IMPLEMENT FORM VALIDATION';
  }

  getSubmitFormValue(formValue) {
    const data = { ...formValue };
    this.numberTypeColumns.forEach(key => data[key] = Number(data[key]));
    return data;
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
