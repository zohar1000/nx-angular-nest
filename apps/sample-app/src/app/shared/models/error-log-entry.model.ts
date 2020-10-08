import { SeverityLevel } from '../../../../../../libs/shared/src/lib/enums/severity-level.enum';

export interface ErrorLogEntry {
  severityLevel: SeverityLevel;
  time: Date;
  message: string;
  eventName?: string;
  eventMessage?: string;
  // extraInfo: any[] = [];
  stack: string;
  additionalParams?: any[];
}
