import { LogifyConfigOptions } from "../../src/docs/docs";
import LogifyLogger from '../../src/assets/coreLogger/logger';
import ErrorsManager from '../../src/assets/errors/errorsManager';
import LogifyMiddlewares from '../../src/assets/middlewares/middlewares';

declare class Logify {
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

export default Logify;