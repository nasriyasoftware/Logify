/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'stream';
import { AppErrorOptions } from '../../docs/docs';
import AppError from './assets/AppError';
declare class ErrorsManager {
    private readonly _eventEmitter;
    constructor(eventEmitter: EventEmitter);
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
    AppError(options: AppErrorOptions): AppError;
}
export default ErrorsManager;
