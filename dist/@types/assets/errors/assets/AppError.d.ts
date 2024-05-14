/// <reference types="node" />
import { AppErrorOptions, ErrorFlags, ErrorSeverity } from "../../../docs/docs";
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
declare class AppError extends Error {
    private readonly _eventEmitter;
    /**The error ID. You can assign the HTTP request ID for better tracking */
    readonly _id: string;
    /**The namespace of the error */
    readonly name: string;
    /**The error message/description */
    readonly message: string;
    /**An optional HTTP code for server errors */
    readonly httpCode: number | undefined;
    /**Flags to attach to the error */
    readonly flags: ErrorFlags;
    /**Error data */
    readonly data: Record<string, any> | undefined;
    /**The Date & Time of the error in ISO string format */
    readonly time: string;
    /**The error severity */
    severity: ErrorSeverity;
    private _flags;
    constructor(options: AppErrorOptions, eventEmitter: EventEmitter);
}
export default AppError;
