# angular2-smart-logger

The implementation of logger for Angular2.

## Installation

First you need to install the npm module:
```sh
npm install angular2-smart-logger --save
```

## Use

**main.ts**
```typescript
// Configure the logger before loading all the internal classes
import {LoggerFactory} from 'angular2-smart-logger';

LoggerFactory.configure(require('./config/log/default.json')); // Optional call
// or
LoggerFactory.configure(require('./config/log/ProductionLoggerConfig').ProductionLoggerConfig);
```

**LoggedFirstClass.ts**
```typescript
class LoggedFirstClass {
   private logger:ILogger = LoggerFactory.makeLogger(LoggedFirstClass);

   public logAtFirstClass() {
       this.logger.info(new Error("!"));
       this.logger.warn(new Error("!"));
                       
       this.logger.debug((logger:IEnvironmentLogger) => {
           // Here may be different kinds of complex calculations, performed only in logging mode
           const i = 100 + 200;
           logger.write(300, i);    // <=> console.debug(300, 300);
       });

       this.logger.error((logger:IEnvironmentLogger) => {
           // Here may be different kinds of complex calculations, performed only in logging mode
           const i = 400 + 500;
           logger.write(600, i);    // <=> console.error(300, 300);
       });
   }
}
```

**config.json**
```json
{
    "debugLevelPath": "[0-9]+",
    "infoLevelPath": ".",
    "logLevelPath": ".",
    "warnLevelPath": ".",
    "errorLevelPath": "[^LoggedFirstClass]",
    "logLevel": 3
}
```

## License

Licensed under MIT.