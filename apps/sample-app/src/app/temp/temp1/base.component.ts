import { Directive, Input } from '@angular/core';

@Directive()
export abstract class BaseComponent {
  @Input() data;
}
