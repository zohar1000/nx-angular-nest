import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent {
  @Output() cancel = new EventEmitter();
  @Output() submit = new EventEmitter();

  onClickCancel() {
    this.cancel.emit();
  }

  onClickSubmit() {
    this.submit.emit();
  }
}
