import { EventEmitter } from 'events';
import { AppErrorOptions, ErrorFlags, ErrorSeverity } from '../../../../../src/docs/docs';
/**
 * Create a new `AppError`. This is a generic error.
 *
 * **Example**
 * ```ts
 * import Logify from 'nasriya-logify';
 * const logify = new Logify();
 *
 * throw logger.errors.AppError({ name: 'PaymentError', message: 'Something went wrong' })
 * ```
 */
declare class AppError extends Error {
    /** The error ID. You can assign the HTTP request ID for better tracking. */
    public readonly _id: string;
    /** The namespace of the error. */
    public readonly name: string;
    /** The error message/description. */
    public readonly message: string;
    /** An optional HTTP code for server errors. */
    public readonly httpCode?: number;
    /** Flags to attach to the error. */
    public readonly flags: ErrorFlags;
    /** Error data. */
    public readonly data?: Record<string, any>;
    /** The Date & Time of the error in ISO string format. */
    public readonly time: string;
    /** The error severity. */
    public readonly severity: ErrorSeverity;

    /**
     * Create a new instance of AppError.
     * @param options The options for creating the error.
     * @param eventEmitter The EventEmitter instance.
     */
    constructor(options: AppErrorOptions, eventEmitter: EventEmitter);
}

export default AppError;