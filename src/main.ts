import { ErrorsManager } from "./assets/errors/errorsManager";
import { logifyLogger } from './assets/coreLogger/logger';

import { LogifyInitOptions, UncaughtException } from "./docs/docs";
import helpers from './utils/helpers';
import { EventEmitter } from 'events';

class Logify {
    private readonly _eventEmitter = new EventEmitter();
    private _errorsManager = new ErrorsManager(this._eventEmitter);
    private _logger = new logifyLogger(this._eventEmitter);
    private _config = {
        service: `process_${process.pid}`,
    }

    private _userHandlers = {
        uncaughtException: undefined as UncaughtException | undefined,
    }

    constructor(options?: LogifyInitOptions) {
        try {
            if (!helpers.isUndefined(options) && helpers.isRealObject(options)) {
                if ('service' in options) {
                    if (!helpers.isUndefined(options.service) && helpers.isValidString(options.service)) {
                        this._config.service = options.service;
                    } else {
                        throw new Error(`The 'service' name expects a valid string value, but instead got ${typeof options.service}`)
                    }
                }

                if ('handlers' in options) {
                    if (helpers.isUndefined(options.handlers) || !helpers.isRealObject(options.handlers)) {
                        throw new Error(`The 'handlers' is expecting an object, but instead got ${typeof options.handlers}`)
                    }

                    if ('uncaughtException' in options.handlers) {
                        if (helpers.isUndefined(options.handlers.uncaughtException) || typeof options.handlers.uncaughtException !== 'function') {
                            throw new Error(`The 'uncaughtException' handler expects a function, but instead got ${typeof options.handlers.uncaughtException}`)
                        }

                        this._userHandlers['uncaughtException'] = options.handlers.uncaughtException;
                    }
                }

                if ('logLocation' in options) {
                    if (!helpers.isUndefined(options.logLocation) && helpers.isValidString(options.logLocation)) {
                        this._eventEmitter.emit('LogifyLogLocationChange', options.logLocation);
                    } else {
                        throw new Error(`The 'logLocation' name expects a valid string value, but instead got ${typeof options.service}`)
                    }
                }
            }

            // Initializing
            const uncaughtException = this._userHandlers.uncaughtException;
            if (!helpers.isUndefined(uncaughtException)) {
                process.on('uncaughtException', (error, origin) => {
                    uncaughtException(error, origin);
                })
            }
        } catch (error) {
            throw new Error(`Logify Initialization Error: ${error instanceof Error ? error.message : error}`)
        }
    }

    /**Error Management APIs */
    get errors(): ErrorsManager { return this._errorsManager }
    /**Logger APIs to add things to the log */
    get logger(): logifyLogger { return this._logger }
    /**The name of the current service */
    get service() { return this._config.service }
}

export default Logify;