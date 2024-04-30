import { EventEmitter } from 'events';
import { LogType } from '../../../../src/docs/docs';

declare class LogifyLogger {
    constructor(eventEmitter: EventEmitter);

    log(data: any, type?: LogType): void;
}

export default LogifyLogger;
