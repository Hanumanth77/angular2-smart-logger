import {Type} from '@angular/core';

import {ILoggerCallback} from './ILoggerCallback';

export type LoggerPayload = Object | ILoggerCallback;

export interface ILogger {

    setLoggedClass(loggedClass:Type):ILogger;

    debug(...payloads:LoggerPayload[]);

    info(...payloads:LoggerPayload[]);

    log(...payloads:LoggerPayload[]);

    warn(...payloads:LoggerPayload[]);

    error(...payloads:LoggerPayload[]);
}
