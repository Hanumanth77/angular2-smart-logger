import {Type} from '@angular/core';

import {isFunction} from '@angular/common/src/facade/lang';

import {ILogger} from './ILogger';
import {ILoggerConfig} from './ILoggerConfig';
import {LoggerPayload} from './ILogger';
import {ILoggerCallback} from './ILoggerCallback';

import {ERROR_LEVEL} from './ILoggerLevel';
import {WARN_LEVEL} from './ILoggerLevel';
import {NOTICE_LEVEL} from './ILoggerLevel';
import {INFO_LEVEL} from './ILoggerLevel';
import {DEBUG_LEVEL} from './ILoggerLevel';

const CONSOLE_FN_DICTIONARY = {
    [DEBUG_LEVEL]: 'debug',
    [INFO_LEVEL]: 'info',
    [NOTICE_LEVEL]: 'log',
    [WARN_LEVEL]: 'warn',
    [ERROR_LEVEL]: 'error'
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
        this.write(DEBUG_LEVEL, this.loggerConfig.debugLevelPath, payload);
    }

    public info(payload:LoggerPayload) {
        this.write(INFO_LEVEL, this.loggerConfig.debugLevelPath, payload);
    }

    public log(payload:LoggerPayload) {
        this.write(NOTICE_LEVEL, this.loggerConfig.logLevelPath, payload);
    }

    public warn(payload:LoggerPayload) {
        this.write(NOTICE_LEVEL, this.loggerConfig.logLevelPath, payload);
    }

    public error(payload:LoggerPayload) {
        this.write(ERROR_LEVEL, this.loggerConfig.errorLevelPath, payload);
    }

    private write(level:number, levelPath:string, payload:LoggerPayload) {
        if (level > this.loggerConfig.logLevel) {
            return;
        }

        const loggedClassPath:string = this.getPath();
        if (loggedClassPath && !new RegExp(levelPath).test(loggedClassPath)) {
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

    private getPath():string {
        return this.loggedClass ? this.loggedClass.name : null;
    }
}
