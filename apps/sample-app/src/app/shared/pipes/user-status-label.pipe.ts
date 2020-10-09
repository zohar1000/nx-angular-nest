import { Pipe, PipeTransform } from '@angular/core';
import { UserStatusLabels } from '../consts/user-status.const';
import memo from 'memo-decorator';

@Pipe({name: 'userStatusLabel'})
export class UserStatusLabelPipe implements PipeTransform {
  @memo()
  transform(value: number): string {
    return UserStatusLabels[value];
  }
}


