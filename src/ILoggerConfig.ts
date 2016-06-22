export interface ILoggerConfig {

    debugLevelClassesRegexp?:string;
    infoLevelClassesRegexp?:string;
    logLevelClassesRegexp?:string;
    warnLevelClassesRegexp?:string;
    errorLevelClassesRegexp?:string;

    /**
     * https://tools.ietf.org/html/rfc5424
     *
     * 0  Emergency: system is unusable
     * 1  Alert: action must be taken immediately
     * 2  Critical: critical conditions
     * 3  Error: error conditions
     * 4  Warning: warning conditions
     * 5  Notice: normal but significant condition
     * 6  Informational: informational messages
     * 7  Debug: debug-level messages
     */
    logLevel: number;
}
