import {Type} from '@angular/core';

import {isPresent} from '@angular/common/src/facade/lang';

import {ILogger} from './ILogger';
import {Logger} from './Logger';
import {ILoggerConfig} from './ILoggerConfig';
import {DEBUG_LEVEL} from './ILoggerLevel';
import {INFO_LEVEL} from './ILoggerLevel';
import {NOTICE_LEVEL} from './ILoggerLevel';
import {WARN_LEVEL} from './ILoggerLevel';
import {ERROR_LEVEL} from './ILoggerLevel';

const LOG_CONFIG_STORE_PARAMETER:string = "__logConfig",
    GLOBAL_LOGGER_FACTORY_PARAMETER:string = '$$LoggerFactory';

const consoleDebugFn = console.debug,
    consoleInfoFn = console.info,
    consoleNoticeFn = console.log,
    consoleWarnFn = console.warn,
    consoleErrorFn = console.error,
    consoleStubFn = function () {
    };

export class LoggerFactory {

    private static config:ILoggerConfig = {
        logLevel: DEBUG_LEVEL
    };

    public static makeLogger(clazz?:Type):ILogger {
        return new Logger(LoggerFactory.config).setLoggedClass(clazz);
    }

    /**
     * Optional call. It may be caused by, maybe not
     *
     * @param outerConfig ILoggerConfig
     */
    public static configure(outerConfig?:ILoggerConfig) {
        const loggerConfig:ILoggerConfig = this.tryGetFromStorage();

        // Formation of configuration based on the priority:
        //
        // The first priority: the config from localStorage
        // The second priority: the config from outer file
        // The third priority: the local config at current class

        LoggerFactory.config = Object.assign(
            Object.assign(LoggerFactory.config, outerConfig),
            loggerConfig
        );

        this.refreshEnvLoggersFunctions();
    }

    /**
     * The level of logging. It can be called the runtime
     *
     * @param logLevel The level of logging
     */
    public static configureLogLevel(logLevel:number) {
        this.config.logLevel = logLevel;

        this.refreshEnvLoggersFunctions();
    }

    /**
     * Saving the configuration in the local storage
     *
     * @param config Config
     */
    public static storeConfig(config:ILoggerConfig) {
        isPresent(localStorage) && localStorage.setItem(LOG_CONFIG_STORE_PARAMETER, JSON.stringify(config));
    }

    private static tryGetFromStorage():ILoggerConfig {
        try {
            return isPresent(localStorage) ? <ILoggerConfig>JSON.parse(localStorage.getItem(LOG_CONFIG_STORE_PARAMETER)) : null;
        } catch (e) {
            return null;
        }
    }

    private static refreshEnvLoggersFunctions() {
        console.debug =
            console.info =
                console.log =
                    console.warn =
                        console.error = consoleStubFn;

        if (this.config.logLevel >= ERROR_LEVEL) {
            console.error = consoleErrorFn;
        }
        if (this.config.logLevel >= WARN_LEVEL) {
            console.warn = consoleWarnFn;
        }
        if (this.config.logLevel >= NOTICE_LEVEL) {
            console.log = consoleNoticeFn;
        }
        if (this.config.logLevel >= INFO_LEVEL) {
            console.info = consoleInfoFn;
        }
        if (this.config.logLevel >= DEBUG_LEVEL) {
            console.debug = consoleDebugFn;
        }
    }
}

window[GLOBAL_LOGGER_FACTORY_PARAMETER] = LoggerFactory;
