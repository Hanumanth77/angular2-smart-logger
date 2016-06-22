import {Type} from '@angular/core';

import {IEnvironmentLogger} from './IEnvironmentlogger';

export interface ILoggerCallback extends Type {

    (logger:IEnvironmentLogger);
}
