import { SeverityLevel } from '@shared/enums/severity-level.enum';

export interface ErrorLogEntry {
  severityLevel: SeverityLevel;
  time: Date;
  message: string;
  eventName?: string;
  eventMessage?: string;
  stack: string | undefined;
  additionalParams?: any[];
}
