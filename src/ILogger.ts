import {Type} from '@angular/core';

import {ILoggerCallback} from './ILoggerCallback';

export type LoggerPayload = Object | ILoggerCallback;

export interface ILogger {

    setLoggedClass(loggedClass:Type):ILogger;

    debug(payload:LoggerPayload);

    info(payload:LoggerPayload);

    log(payload:LoggerPayload);

    warn(payload:LoggerPayload);

    error(payload:LoggerPayload);
}
