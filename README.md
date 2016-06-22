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
```

**Module.ts**
```typescript
export class Module {

    private logger:ILogger = LoggerFactory.makeLogger(Module);
    
    log() {
       this.logger.debug(`Debug message`);
       
       // or
       this.logger.debug((environmentLogger:ILoggerCallback) => {
           environmentLogger.write(1, 2, 3);
       });
    }
}
```

**config.json**
```json
{
  "logLevelPath": "[0-9]+",
  "errorLevelPath": ".",
  "debugLevelPath": "Module",
  "logLevel": 5
}
```

## License

Licensed under MIT.