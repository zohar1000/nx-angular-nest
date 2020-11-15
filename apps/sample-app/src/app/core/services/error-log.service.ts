import { Injectable } from '@angular/core';
import SafeStringify from 'fast-safe-stringify';
import { SeverityLevel } from '../../../../../../libs/shared/src/lib/enums/severity-level.enum';
import { ErrorLogEntry } from '@sample-app/shared/models/error-log-entry.model';

@Injectable({ providedIn: 'root' })
export class ErrorLogService {
  logCritical(message, ...params) {
    this.writeToLog(SeverityLevel.Critical, message, ...params);
  }

  logError(message, ...params) {
    this.writeToLog(SeverityLevel.Error, message, ...params);
  }

  logWarning(message, ...params) {
    this.writeToLog(SeverityLevel.Warning, message, ...params);
  }

  logInfo(message, ...params) {
    this.writeToLog(SeverityLevel.Info, message, ...params);
  }

  writeToLog(level, message, ...params) {
    const entry: ErrorLogEntry = this.getNewEntry(level, message);
    let error;

    for (const param of params) {
      if (param instanceof Error) {
        if (!error) error = param;
        entry.eventName = param.name;
        entry.eventMessage = param.message;
        entry.stack = param.stack;
      } else {
        entry.additionalParams = entry.additionalParams || [];
        entry.additionalParams.push(param);
      }
    }
    if (!entry.stack) entry.stack = (new Error()).stack;
    this.printToConsole(entry, error);
  }

  printToConsole(logEntry: ErrorLogEntry, error: Error) {
    const COLORS = {
      [SeverityLevel.Error]: '\x1b[31m',   // red
      [SeverityLevel.Warning]: '\x1b[35m',    // magenta
      [SeverityLevel.Info]: '\x1b[34m',    // blue
      default: '\x1b[37m'  // white
    };

    const color = COLORS[logEntry.severityLevel];
    const print = text => console.log(color + text);

    console.group(color + 'LOG EVENT MESSAGE  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    if (logEntry.message) print(`Message: '${logEntry.message}'`);
    if (logEntry.eventName && logEntry.eventName !== 'Error') print(`Error event name: ${logEntry.eventName}`);
    if (logEntry.eventMessage) print(`Error event message: '${logEntry.eventMessage}'`);
    if (error) console.error(error);
    if (logEntry.additionalParams) {
      console.group(color + 'Additional params:');
      logEntry.additionalParams.forEach(info => typeof(info) === 'object' ? print(SafeStringify(info, undefined, 0)) : print(info));
      console.groupEnd();
    }
    console.warn(color + 'Stack trace');
    print('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.groupEnd();
  }

  getNewEntry(severityLevel: SeverityLevel, message): ErrorLogEntry {
    return {
      severityLevel,
      time: new Date(),
      message,
      stack: ''
    }
  }
}
