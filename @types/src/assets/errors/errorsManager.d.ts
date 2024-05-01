import { AppErrorOptions } from '../../../../src/docs/docs';
import AppError from './assets/AppError';

declare class ErrorsManager {
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
