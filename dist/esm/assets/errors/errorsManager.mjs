import AppError from './assets/AppError';
class ErrorsManager {
    _eventEmitter;
    constructor(eventEmitter) {
        this._eventEmitter = eventEmitter;
    }
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
    AppError(options) {
        return new AppError(options, this._eventEmitter);
    }
}
export default ErrorsManager;
