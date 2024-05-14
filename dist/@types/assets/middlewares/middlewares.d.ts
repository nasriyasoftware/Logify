import LogifyLogger from "../coreLogger/logger";
declare class LogifyMiddlewares {
    private readonly _logger;
    private readonly _diver;
    constructor(logger: LogifyLogger);
    private readonly _utils;
    /**A middleware used specifically with Nasriya HyperCloud framework */
    readonly hypercloud: (request: Record<string, any>, response: Record<string, any>, next: Function) => any;
}
export default LogifyMiddlewares;
