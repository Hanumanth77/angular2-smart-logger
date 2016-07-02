import {Type} from '@angular/core';

import {
    isFunction,
    isPresent,
    isString
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
 *          this.logger.debug(`Test`);
 *
 *          // Logging the "payload" object - to perform the callback
 *          this.logger.debug((logger:IEnvironmentLogger) => {
 *
 *              // Here may be different kinds of complex calculations, performed only in logging mode
 *              const i = 100 + 200;
 *              logger.write(200, i);       // <=> console.debug(200, 300);
 *          });
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

    public debug(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.DEBUG_LEVEL, payload, this.loggerConfig.debugLevelPath);
    }

    public info(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.INFO_LEVEL, payload, this.loggerConfig.infoLevelPath);
    }

    public log(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.NOTICE_LEVEL, payload, this.loggerConfig.logLevelPath);
    }

    public warn(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.WARN_LEVEL, payload, this.loggerConfig.warnLevelPath);
    }

    public error(payload:LoggerPayload) {
        this.write(LoggerLevelEnum.ERROR_LEVEL, payload, this.loggerConfig.errorLevelPath);
    }

    /**
     * Write the message into an output stream or perform payload if it is presented as a callback function.
     *
     * @param logLevel The log level
     * @param payload The payload for logging (message or callback for execution)
     * @param configuredLevelPath The regular expression for filtering payloads by their belonging to a specific class
     */
    private write(logLevel:LoggerLevelEnum, payload:LoggerPayload, configuredLevelPath?:string) {
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

        if (isFunction(payload)) {
            (payload as ILoggerCallback)({
                write(...parameters) {
                    consoleFn.apply(console, parameters);
                }
            });
        } else {
            consoleFn.call(console, payload);
        }
    }

    private getLoggedClassName():string {
        if (!isPresent(this.loggedClass)) {
            return null;
        }
        return isString(this.loggedClass) ? this.loggedClass as string : (this.loggedClass as Type).name;
    }
}
