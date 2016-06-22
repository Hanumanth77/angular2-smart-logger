import {Type} from '@angular/core';

import {isFunction} from '@angular/common/src/facade/lang';

import {ILogger} from './ILogger';
import {ILoggerConfig} from './ILoggerConfig';
import {IEnvironmentLogger} from './IEnvironmentLogger';
import {LoggerPayload} from './ILogger';
import {ILoggerCallback} from './ILoggerCallback';
import {LoggerLevelEnum} from './LoggerLevelEnum';

const CONSOLE_FN_DICTIONARY = {
    [LoggerLevelEnum.DEBUG_LEVEL]: 'debug',
    [LoggerLevelEnum.INFO_LEVEL]: 'info',
    [LoggerLevelEnum.NOTICE_LEVEL]: 'log',
    [LoggerLevelEnum.WARN_LEVEL]: 'warn',
    [LoggerLevelEnum.ERROR_LEVEL]: 'error'
};

/**
 * Customizable logging mechanism.
 * The Logger should be instantiated via @LoggerFactory as a member of a class or as a static field.
 *
 * Usage example:
 *
 *   class A {
 *      private logger:ILogger = LoggerFactory.makeLogger(A);
 *
 *      methodA() {
 *          // Logging the simple object
 *          this.logger.debug(`Test`);
 *
 *          // Logging the "payload" object
 *          this.logger.debug((logger:IEnvironmentLogger) => {
 *              const i = 100;
 *              logger.write(200, i);
 *          });
 *      }
 *   }
 */
export class Logger implements ILogger {

    private loggerConfig:ILoggerConfig;
    private loggedClass:Type;

    constructor(loggerConfig:ILoggerConfig) {
        this.loggerConfig = loggerConfig;
    }

    public setLoggedClass(loggedClass?:Type):ILogger {
        this.loggedClass = loggedClass;
        return this;
    }

    public debug(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.DEBUG_LEVEL, this.loggerConfig.debugLevelClassesRegexp, payload);
    }

    public info(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.INFO_LEVEL, this.loggerConfig.debugLevelClassesRegexp, payload);
    }

    public log(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.NOTICE_LEVEL, this.loggerConfig.logLevelClassesRegexp, payload);
    }

    public warn(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.NOTICE_LEVEL, this.loggerConfig.logLevelClassesRegexp, payload);
    }

    public error(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.ERROR_LEVEL, this.loggerConfig.errorLevelClassesRegexp, payload);
    }

    private write(level:number, classesRegexp:string, payload:LoggerPayload) {
        if (level > this.loggerConfig.logLevel) {
            return;
        }

        const loggedClassName:string = this.getLoggedClassName();
        if (loggedClassName && !new RegExp(classesRegexp).test(loggedClassName)) {
            return;
        }

        const systemLoggerFn:Type = console[CONSOLE_FN_DICTIONARY[level]];

        if (isFunction(payload)) {
            (payload as ILoggerCallback)({
                write(...parameters) {
                    systemLoggerFn.apply(console, parameters);
                }
            });
        } else {
            systemLoggerFn.call(console, payload);
        }
    }

    private getLoggedClassName():string {
        return this.loggedClass ? this.loggedClass.name : null;
    }
}
