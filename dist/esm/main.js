import helpers from './utils/helpers';
import { EventEmitter } from 'events';
import ErrorsManager from "./assets/errors/errorsManager";
import LogifyMiddlewares from "./assets/middlewares/middlewares";
import LogifyLogger from "./assets/coreLogger/logger";
export class Logify {
    _eventEmitter = new EventEmitter();
    _errorsManager = new ErrorsManager(this._eventEmitter);
    _logger = new LogifyLogger(this._eventEmitter);
    _middlewares = new LogifyMiddlewares(this._logger);
    _config = {
        service: `process_${process.pid}`,
    };
    _userHandlers = {
        /**@type {UncaughtException} */
        uncaughtException: undefined,
    };
    constructor() {
        process.on('uncaughtException', (error, origin) => {
            if (typeof this._userHandlers.uncaughtException === 'function') {
                this._userHandlers.uncaughtException(error, origin);
            }
        });
    }
    /**
     * Configure logify to suite your needs
     * @param options Options to configure the Logify module
     * @returns {void}
     */
    config(options) {
        try {
            if (helpers.isUndefined(options) || !helpers.isRealObject(options)) {
                return;
            }
            if ('service' in options) {
                if (!helpers.isUndefined(options.service) && helpers.isValidString(options.service)) {
                    this._config.service = options.service;
                }
                else {
                    throw new Error(`The 'service' name expects a valid string value, but instead got ${typeof options.service}`);
                }
            }
            if ('handlers' in options) {
                if (helpers.isUndefined(options.handlers) || !helpers.isRealObject(options.handlers)) {
                    throw new Error(`The 'handlers' is expecting an object, but instead got ${typeof options.handlers}`);
                }
                if ('uncaughtException' in options.handlers) {
                    if (helpers.isUndefined(options.handlers.uncaughtException) || typeof options.handlers.uncaughtException !== 'function') {
                        throw new Error(`The 'uncaughtException' handler expects a function, but instead got ${typeof options.handlers.uncaughtException}`);
                    }
                    this._userHandlers['uncaughtException'] = options.handlers.uncaughtException;
                }
            }
            if ('logLocation' in options) {
                if (!helpers.isUndefined(options.logLocation) && helpers.isValidString(options.logLocation)) {
                    this._eventEmitter.emit('LogifyLogLocationChange', options.logLocation);
                }
                else {
                    throw new Error(`The 'logLocation' name expects a valid string value, but instead got ${typeof options.service}`);
                }
            }
        }
        catch (error) {
            throw new Error(`Logify Initialization Error: ${error instanceof Error ? error.message : error}`);
        }
    }
    /**Error Management APIs */
    get errors() { return this._errorsManager; }
    /**Logger APIs to add things to the log */
    get logger() { return this._logger; }
    /**The name of the current service */
    get service() { return this._config.service; }
    /**Middlewares for servers */
    get middlewares() { return this._middlewares; }
}
export default new Logify;
