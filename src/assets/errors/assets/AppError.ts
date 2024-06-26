import { AppErrorOptions, ErrorFlags, ErrorSeverity } from "../../../docs/docs";
import helpers from "../../../utils/helpers";
import { EventEmitter } from 'events';

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
    private readonly _eventEmitter: EventEmitter;

    /**The error ID. You can assign the HTTP request ID for better tracking */
    public readonly _id: string;
    /**The namespace of the error */
    public readonly name: string;
    /**The error message/description */
    public readonly message: string;
    /**An optional HTTP code for server errors */
    public readonly httpCode: number | undefined;
    /**Flags to attach to the error */
    public readonly flags: ErrorFlags;
    /**Error data */
    public readonly data: Record<string, any> | undefined;
    /**The Date & Time of the error in ISO string format */
    public readonly time = new Date().toISOString();
    /**The error severity */
    public severity: ErrorSeverity = 'Low';

    private _flags: ErrorFlags = {
        isOperational: false,
        isHTTP: false,
    }

    constructor(options: AppErrorOptions, eventEmitter: EventEmitter) {
        if (helpers.isUndefined(options) || !helpers.isRealObject(options)) { throw new Error('The AppError has been initialized without options') }
        super(helpers.isValidString(options.message) ? options.message : 'AppError: Argument error');
        // Object.setPrototypeOf(this, Error.prototype);
        this._eventEmitter = eventEmitter;

        if ('name' in options) {
            if (!helpers.isUndefined(options.name) && helpers.isValidString(options.name)) {
                this.name = options.name;
            } else {
                throw new TypeError(`AppError: The error 'name' must be a string. Instead got ${typeof options.name}`);
            }
        } else {
            this.name = 'AppError';
        }

        if ('message' in options) {
            if (!helpers.isUndefined(options.message) && helpers.isValidString(options.message)) {
                this.message = options.message;
            } else {
                throw new TypeError(`AppError: The error 'message' must be a string. Instead got ${typeof options.message}`);
            }
        } else {
            throw new Error(`AppError: The error 'message' is missing from the options.`);
        }

        if ('requestId' in options) {
            if (!helpers.isUndefined(options.requestId) && helpers.isValidString(options.requestId)) {
                this._id = options.requestId;
            } else {
                throw new TypeError(`AppError: The error 'requestId' must be a string. Instead got ${typeof options.requestId}`);
            }
        } else {
            this._id = helpers.generateRandom(32, { includeSymbols: false });
        }

        if ('severity' in options) {
            if (!helpers.isUndefined(options.severity) && helpers.isValidString(options.severity)) {
                if (['High', 'Medium', 'Low'].includes(options.severity)) {
                    this.severity = options.severity;
                } else {
                    throw new TypeError(`AppError: The error 'severity' must be a string. Instead got ${typeof options.severity}`);
                }
            } else {
                throw new TypeError(`AppError: The error 'severity' must be a string. Instead got ${typeof options.severity}`);
            }
        }

        if ('httpCode' in options) {
            if (typeof options.httpCode === 'number') {
                this.httpCode = options.httpCode;
            } else {
                throw new TypeError(`AppError: The error 'httpCode' must be a number. Instead got ${typeof options.httpCode}`);
            }
        }

        if ('flags' in options) {
            if (helpers.isUndefined(options.flags) || !helpers.isRealObject(options.flags)) {
                throw new TypeError(`AppError: The 'flags' is expected to be an object. Instead got ${typeof options.flags}`);
            }

            // Scan the provided flags
            for (const flag in options.flags) {
                if (typeof options.flags[flag] === 'boolean') {
                    this._flags[flag] = options.flags[flag];
                } else {
                    throw new TypeError(`AppError: Flags are expected to have boolean values, while ${flag}'s type was ${typeof options.flags[flag]}`);
                }
            }
        }

        if ('data' in options) {
            if (helpers.isUndefined(options.data) || !helpers.isRealObject(options.data)) {
                throw new TypeError(`AppError: The 'data' is expected to be an object. Instead got ${typeof options.data}`);
            }

            this.data = { ...options.data }
        }

        this.flags = this._flags;
        this._eventEmitter.emit('LogifyError', this);
    }
}

export default AppError;