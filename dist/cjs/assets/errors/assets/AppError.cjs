"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../../utils/helpers"));
/**
 * Create a new `AppError`. This is a generic error.
 *
 * **Example**
 * ```ts
 * import logify from 'nasriya-logify';
 *
 * throw logify.errors.AppError({ name: 'PaymentError', description: 'Something went wrong' })
 * ```
 */
class AppError extends Error {
    _eventEmitter;
    /**The error ID. You can assign the HTTP request ID for better tracking */
    _id;
    /**The namespace of the error */
    name;
    /**The error message/description */
    message;
    /**An optional HTTP code for server errors */
    httpCode;
    /**Flags to attach to the error */
    flags;
    /**Error data */
    data;
    /**The Date & Time of the error in ISO string format */
    time = new Date().toISOString();
    /**The error severity */
    severity = 'Low';
    _flags = {
        isOperational: false,
        isHTTP: false,
    };
    constructor(options, eventEmitter) {
        if (helpers_1.default.isUndefined(options) || !helpers_1.default.isRealObject(options)) {
            throw new Error('The AppError has been initialized without options');
        }
        super(helpers_1.default.isValidString(options.message) ? options.message : 'AppError: Argument error');
        // Object.setPrototypeOf(this, Error.prototype);
        this._eventEmitter = eventEmitter;
        if ('name' in options) {
            if (!helpers_1.default.isUndefined(options.name) && helpers_1.default.isValidString(options.name)) {
                this.name = options.name;
            }
            else {
                throw new TypeError(`AppError: The error 'name' must be a string. Instead got ${typeof options.name}`);
            }
        }
        else {
            this.name = 'AppError';
        }
        if ('message' in options) {
            if (!helpers_1.default.isUndefined(options.message) && helpers_1.default.isValidString(options.message)) {
                this.message = options.message;
            }
            else {
                throw new TypeError(`AppError: The error 'message' must be a string. Instead got ${typeof options.message}`);
            }
        }
        else {
            throw new Error(`AppError: The error 'message' is missing from the options.`);
        }
        if ('requestId' in options) {
            if (!helpers_1.default.isUndefined(options.requestId) && helpers_1.default.isValidString(options.requestId)) {
                this._id = options.requestId;
            }
            else {
                throw new TypeError(`AppError: The error 'requestId' must be a string. Instead got ${typeof options.requestId}`);
            }
        }
        else {
            this._id = helpers_1.default.generateRandom(32, { includeSymbols: false });
        }
        if ('severity' in options) {
            if (!helpers_1.default.isUndefined(options.severity) && helpers_1.default.isValidString(options.severity)) {
                if (['High', 'Medium', 'Low'].includes(options.severity)) {
                    this.severity = options.severity;
                }
                else {
                    throw new TypeError(`AppError: The error 'severity' must be a string. Instead got ${typeof options.severity}`);
                }
            }
            else {
                throw new TypeError(`AppError: The error 'severity' must be a string. Instead got ${typeof options.severity}`);
            }
        }
        if ('httpCode' in options) {
            if (typeof options.httpCode === 'number') {
                this.httpCode = options.httpCode;
            }
            else {
                throw new TypeError(`AppError: The error 'httpCode' must be a number. Instead got ${typeof options.httpCode}`);
            }
        }
        if ('flags' in options) {
            if (helpers_1.default.isUndefined(options.flags) || !helpers_1.default.isRealObject(options.flags)) {
                throw new TypeError(`AppError: The 'flags' is expected to be an object. Instead got ${typeof options.flags}`);
            }
            // Scan the provided flags
            for (const flag in options.flags) {
                if (typeof options.flags[flag] === 'boolean') {
                    this._flags[flag] = options.flags[flag];
                }
                else {
                    throw new TypeError(`AppError: Flags are expected to have boolean values, while ${flag}'s type was ${typeof options.flags[flag]}`);
                }
            }
        }
        if ('data' in options) {
            if (helpers_1.default.isUndefined(options.data) || !helpers_1.default.isRealObject(options.data)) {
                throw new TypeError(`AppError: The 'data' is expected to be an object. Instead got ${typeof options.data}`);
            }
            this.data = { ...options.data };
        }
        this.flags = this._flags;
        this._eventEmitter.emit('LogifyError', this);
    }
}
exports.default = AppError;
