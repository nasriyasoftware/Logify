import { EventEmitter } from 'events';
import { ErrorsManager } from "../../src/assets/errors/errorsManager";
import { logifyLogger } from '../../src/assets/coreLogger/logger';
import { UncaughtException, LogifyInitOptions } from "../../src/docs/docs";

declare class Logify {
    private readonly _eventEmitter: EventEmitter;
    private _errorsManager: ErrorsManager;
    private _logger: logifyLogger;
    private _config: {
        service: string;
    };
    private _userHandlers: {
        uncaughtException: UncaughtException | undefined;
    };

    constructor(options?: LogifyInitOptions);

    /**Error Management APIs */
    get errors(): ErrorsManager;
    /**Logger APIs to add things to the log */
    get logger(): logifyLogger;
    /**The name of the current service */
    get service(): string;
}

export default Logify;
