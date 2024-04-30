import { EventEmitter } from 'stream';
import { AppErrorOptions } from '../../docs/docs';
import AppError from './assets/AppError';

export class ErrorsManager {
    private readonly _eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this._eventEmitter = eventEmitter;
    }

    /**
     * Create a new `AppError`. This is a generic error.
     * 
     * **Example**
     * ```ts
     * import Logify from 'nasriya-logify';
     * const logify = new Logify();
     * 
     * throw logger.errors.AppError({ name: 'PaymentError', description: 'Something went wrong' })
     * ```
     */
    AppError(options: AppErrorOptions): AppError {
        return new AppError(options, this._eventEmitter);
    }
}

export default ErrorsManager;