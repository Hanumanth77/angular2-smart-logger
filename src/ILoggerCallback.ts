import {Type} from '@angular/core';

import {IEnvironmentLogger} from './IEnvironmentLogger';

export interface ILoggerCallback extends Type {

    logger:IEnvironmentLogger;
}
