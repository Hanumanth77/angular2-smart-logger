import {Type} from '@angular/core';

import {isPresent, isType} from '@angular/common/src/facade/lang';

import {ILogger} from './ILogger';
import {Logger} from './Logger';
import {ILoggerConfig} from './ILoggerConfig';
import {LoggerLevelEnum} from './LoggerLevelEnum';

const LOG_CONFIG_STORE_PARAMETER:string = "__logConfig",
    GLOBAL_LOGGER_FACTORY_PARAMETER:string = '$$LoggerFactory';

export const CONSOLE_DEBUG_FN = console.debug,
    CONSOLE_INFO_FN = console.info,
    CONSOLE_NOTICE_FN = console.log,
    CONSOLE_WARN_FN = console.warn,
    CONSOLE_ERROR_FN = console.error,
    CONSOLE_EMPTY_FN = function () {
    };

export class LoggerFactory {

    private static initialConfig:ILoggerConfig = Object.freeze({
        logLevel: LoggerLevelEnum.DEBUG_LEVEL
    });

    private static config:ILoggerConfig = Object.assign({}, LoggerFactory.initialConfig);

    public static makeLogger(loggedClass?:string|Type):ILogger {
        return new Logger(this.config).setLoggedClass(loggedClass);
    }

    /**
     * Optional call. It may be caused by, or maybe not
     *
     * @param outerConfig ILoggerConfig
     */
    public static configure(outerConfig?:{new ():ILoggerConfig}|ILoggerConfig) {
        const storedLoggerConfig:ILoggerConfig = this.tryGetFromStorage();

        // Formation of configuration based on the priority:
        //
        // The first priority: the config from localStorage
        // The second priority: the config from outer file
        // The third priority: the local config at current class

        this.config = Object.assign(
            Object.assign(
                Object.assign({}, LoggerFactory.initialConfig),
                isType(outerConfig) ? new (outerConfig as {new ():ILoggerConfig})() : outerConfig
            ),
            storedLoggerConfig
        );
        this.refreshEnvLoggersFunctions();
    }

    /**
     * The level of logging. It can be called the runtime
     *
     * @param logLevel The level of logging
     */
    public static configureLogLevel(logLevel:LoggerLevelEnum) {
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
                        console.error = CONSOLE_EMPTY_FN;

        if (this.config.logLevel >= LoggerLevelEnum.ERROR_LEVEL) {
            console.error = CONSOLE_ERROR_FN;
        }
        if (this.config.logLevel >= LoggerLevelEnum.WARN_LEVEL) {
            console.warn = CONSOLE_WARN_FN;
        }
        if (this.config.logLevel >= LoggerLevelEnum.NOTICE_LEVEL) {
            console.log = CONSOLE_NOTICE_FN;
        }
        if (this.config.logLevel >= LoggerLevelEnum.INFO_LEVEL) {
            console.info = CONSOLE_INFO_FN;
        }
        if (this.config.logLevel >= LoggerLevelEnum.DEBUG_LEVEL) {
            console.debug = CONSOLE_DEBUG_FN || CONSOLE_INFO_FN;    // IE10 workaround
        }
    }
}

window[GLOBAL_LOGGER_FACTORY_PARAMETER] = LoggerFactory;
