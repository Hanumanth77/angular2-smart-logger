import {Type} from '@angular/core';

import {
    isFunction,
    isPresent,
    isString,
    isArray
} from '@angular/common/src/facade/lang';

import {ILogger} from './ILogger';
import {ILoggerConfig} from './ILoggerConfig';
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
 * Customizable logging mechanism. The logger should be instantiated via @class LoggerFactory as a member of a class or
 * as a static field.
 *
 * @example:
 *   class A {
 *      private logger:ILogger = LoggerFactory.makeLogger(A);
 *
 *      methodA() {
 *          // Logging the simple object
 *          this.logger.debug(`Test`, `Test2`, 100500);
 *
 *          // Logging the "payload" object - to perform the callback
 *          this.logger.debug((logger:IEnvironmentLogger) => {
 *
 *              // Here may be different kinds of complex calculations, performed only in logging mode
 *              const i = 100 + 200;
 *              logger.write(200, i);                       // <=> console.debug(200, 300);
 *          });
 *
 *          // Logging the simple object as return value
 *          this.logger.debug(() => [1, 2, 3].length);      // <=> console.debug([1, 2, 3].length);
 *      }
 *   }
 */
export class Logger implements ILogger {

    private loggerConfig:ILoggerConfig;
    private loggedClass:string|Type;

    constructor(loggerConfig:ILoggerConfig) {
        this.loggerConfig = loggerConfig;
    }

    /**
     * @description: Allows to specify exactly the business logic class for logging.
     * @example:
     *  class MyClass {}
     *  ...
     *  setLoggedClass(MyClass)
     *
     * @param loggedClass The business logic class (optional parameter)
     * @returns {Logger} The current logger
     */
    public setLoggedClass(loggedClass?:string|Type):ILogger {
        this.loggedClass = loggedClass;
        return this;
    }

    public debug(...payloads:LoggerPayload[]) {
        this.write(LoggerLevelEnum.DEBUG_LEVEL, this.loggerConfig.debugLevelPath, payloads);
    }

    public info(...payloads:LoggerPayload[]) {
        this.write(LoggerLevelEnum.INFO_LEVEL, this.loggerConfig.infoLevelPath, payloads);
    }

    public log(...payloads:LoggerPayload[]) {
        this.write(LoggerLevelEnum.NOTICE_LEVEL, this.loggerConfig.logLevelPath, payloads);
    }

    public warn(...payloads:LoggerPayload[]) {
        this.write(LoggerLevelEnum.WARN_LEVEL, this.loggerConfig.warnLevelPath, payloads);
    }

    public error(...payloads:LoggerPayload[]) {
        this.write(LoggerLevelEnum.ERROR_LEVEL, this.loggerConfig.errorLevelPath, payloads);
    }

    /**
     * Write the message into an output stream or perform payload if it is presented as a callback function.
     *
     * @param logLevel The log level
     * @param configuredLevelPath The regular expression for filtering payloads by their belonging to a specific class
     * @param payloads The payload for logging (message or callback for execution)
     */
    private write(logLevel:LoggerLevelEnum, configuredLevelPath:string, ...payloads:LoggerPayload[]) {
        if (logLevel > this.loggerConfig.logLevel) {
            return;
        }

        const loggedClassName:string = this.getLoggedClassName();
        if (isPresent(loggedClassName)
            && isPresent(configuredLevelPath)
            && !new RegExp(configuredLevelPath).test(loggedClassName)) {
            return;
        }

        const consoleFn:Type = console[CONSOLE_FN_DICTIONARY[logLevel]];

        payloads.forEach((payload:LoggerPayload) => {
            if (isArray(payload)) {
                if ((payload as []).length && isFunction(payload[0])) {
                    const returnsPayload = (payload[0] as ILoggerCallback)({
                        write(...parameters) {
                            consoleFn.apply(console, parameters);
                        }
                    });
                    if (isPresent(returnsPayload)) {
                        consoleFn.call(console, returnsPayload);
                    }
                } else {
                    consoleFn.apply(console, payload);
                }
            } else {
                consoleFn.call(console, payload);
            }
        });
    }

    private getLoggedClassName():string {
        if (!isPresent(this.loggedClass)) {
            return null;
        }
        return isString(this.loggedClass) ? this.loggedClass as string : (this.loggedClass as Type).name;
    }
}
