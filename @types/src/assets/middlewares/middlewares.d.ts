declare class LogifyMiddlewares {
    /**A middleware used specifically with Nasriya HyperCloud framework */
    public readonly hypercloud: (request: any, response: any, next: any) => any;
}

export default LogifyMiddlewares;