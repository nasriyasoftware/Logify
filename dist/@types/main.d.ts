import { LogifyConfigOptions } from "./docs/docs";
import ErrorsManager from "./assets/errors/errorsManager";
import LogifyMiddlewares from "./assets/middlewares/middlewares";
import LogifyLogger from "./assets/coreLogger/logger";
export declare class Logify {
    private readonly _eventEmitter;
    private _errorsManager;
    private _logger;
    private _middlewares;
    private _config;
    private _userHandlers;
    constructor();
    /**
     * Configure logify to suite your needs
     * @param options Options to configure the Logify module
     * @returns {void}
     */
    config(options?: LogifyConfigOptions): void;
    /**Error Management APIs */
    get errors(): ErrorsManager;
    /**Logger APIs to add things to the log */
    get logger(): LogifyLogger;
    /**The name of the current service */
    get service(): string;
    /**Middlewares for servers */
    get middlewares(): LogifyMiddlewares;
}
declare const _default: Logify;
export default _default;
