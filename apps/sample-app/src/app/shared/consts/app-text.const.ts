import { AppText } from '@sample-app/shared/models/app-text.model';
import { BehaviorSubject } from 'rxjs';

export let appText$: BehaviorSubject<AppText> = new BehaviorSubject<AppText>(('' as unknown) as AppText);
export const setAppText = (text: AppText) => {
  appText$.next(text);
}

