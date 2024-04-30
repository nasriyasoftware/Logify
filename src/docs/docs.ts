export type ErrorSeverity = 'High' | 'Medium' | 'Low';

export interface AppErrorOptions {
    /**The error message/descrption. */
    message: string;
    /**The error name. Default: `AppError`. */
    name?: string;
    /**The error severity. Default: `Low`. */
    severity?: ErrorSeverity;
    /**If the error is originated in an HTTP request, you can attach the `request.id` as the error ID  */
    requestId?: string;
    /**An HTTP code */
    httpCode?: number;
    flags?: ErrorFlags;
    data?: Record<string, any>
}

export interface ErrorFlags {
    isOperational?: boolean;
    isHTTP?: boolean;    
    [flag: string]: boolean | undefined;
}

export interface LogifyInitOptions {
    /**The name of the running service or process. Default: `process.pid` */
    service?: string;
    /**Set different handlers for more robust error handling */
    handlers?: InitHandlers;
    /**An absolute path to the directory where you want the logs to be stored at. Default: The project directory. */
    logLocation?: string
}

interface InitHandlers {
    /**
     * Handle uncought errors as the last resort.
     * 
     * **Example:**
     * ```ts
     * import Logify from 'nasriya-logify';
     * 
     * const logify = new Logify({
     *      handlers: {
     *          uncaughtException: (error, origin) => {
     *              console.error(error, origin);
     *          }
     *      }
     * })
     * ```
     * @param error The uncought error
     * @param origin The origin of the error
     */
    uncaughtException?: UncaughtException;
}

export type LogType = 'Error' | 'Warn' | 'Info' | 'Log' | 'Assert' | 'Debug' | 'Dir' | 'Table' | 'Trace';
export type UncaughtException = (error: Error, origin: NodeJS.UncaughtExceptionOrigin) => void;