/// <reference types="node" />
import { EventEmitter } from 'events';
import { LogType } from '../../docs/docs';
declare class LogifyLogger {
    private readonly _eventEmitter;
    /**The current logs */
    private _logs;
    constructor(eventEmitter: EventEmitter);
    private readonly _handlers;
    private readonly _utils;
    /**
     * Log something to the console.
     * @param data The data to be logged, it can be anything.
     */
    log(data: any, type?: LogType): void;
}
export default LogifyLogger;
