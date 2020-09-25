import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';
import { RolesLabels } from '@shared/consts/role.const';

@Pipe({name: 'roleLabel'})
export class RoleLabelPipe implements PipeTransform {
  @memo()
  transform(value): string {
    return value ? RolesLabels[value] : '';
  }
}


