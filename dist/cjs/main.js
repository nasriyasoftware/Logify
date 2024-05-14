"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logify = void 0;
const helpers_1 = __importDefault(require("./utils/helpers"));
const events_1 = require("events");
const errorsManager_1 = __importDefault(require("./assets/errors/errorsManager"));
const middlewares_1 = __importDefault(require("./assets/middlewares/middlewares"));
const logger_1 = __importDefault(require("./assets/coreLogger/logger"));
class Logify {
    _eventEmitter = new events_1.EventEmitter();
    _errorsManager = new errorsManager_1.default(this._eventEmitter);
    _logger = new logger_1.default(this._eventEmitter);
    _middlewares = new middlewares_1.default(this._logger);
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
            if (helpers_1.default.isUndefined(options) || !helpers_1.default.isRealObject(options)) {
                return;
            }
            if ('service' in options) {
                if (!helpers_1.default.isUndefined(options.service) && helpers_1.default.isValidString(options.service)) {
                    this._config.service = options.service;
                }
                else {
                    throw new Error(`The 'service' name expects a valid string value, but instead got ${typeof options.service}`);
                }
            }
            if ('handlers' in options) {
                if (helpers_1.default.isUndefined(options.handlers) || !helpers_1.default.isRealObject(options.handlers)) {
                    throw new Error(`The 'handlers' is expecting an object, but instead got ${typeof options.handlers}`);
                }
                if ('uncaughtException' in options.handlers) {
                    if (helpers_1.default.isUndefined(options.handlers.uncaughtException) || typeof options.handlers.uncaughtException !== 'function') {
                        throw new Error(`The 'uncaughtException' handler expects a function, but instead got ${typeof options.handlers.uncaughtException}`);
                    }
                    this._userHandlers['uncaughtException'] = options.handlers.uncaughtException;
                }
            }
            if ('logLocation' in options) {
                if (!helpers_1.default.isUndefined(options.logLocation) && helpers_1.default.isValidString(options.logLocation)) {
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
exports.Logify = Logify;
exports.default = new Logify;
