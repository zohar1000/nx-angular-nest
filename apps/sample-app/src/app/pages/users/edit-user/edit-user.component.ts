import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserComponent {
  @Input() currItem$;
  @Output() cancel = new EventEmitter();
  @Output() submit = new EventEmitter();

  onClickCancel() {
    this.cancel.emit();
  }

  onClickSubmit() {
    this.submit.emit({ id: 102, data: { id: 102}});
  }
}
