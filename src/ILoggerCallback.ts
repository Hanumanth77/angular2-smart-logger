import {Type} from '@angular/core';

import {IEnvironmentLogger} from './IEnviromventlogger';

export interface ILoggerCallback extends Type {

    (logger:IEnvironmentLogger);
}
