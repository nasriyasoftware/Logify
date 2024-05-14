"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const nasriya_cron_1 = __importDefault(require("nasriya-cron"));
const fileSystem_1 = __importDefault(require("../../utils/fileSystem"));
const AppError_1 = __importDefault(require("../errors/assets/AppError"));
const fs_1 = __importDefault(require("fs"));
class LogifyLogger {
    _eventEmitter;
    /**The current logs */
    _logs = [];
    constructor(eventEmitter) {
        this._eventEmitter = eventEmitter;
        this._eventEmitter.on('LogifyError', (error) => this.log(error, 'Error'));
        process.on('exit', this._handlers.exitHandlers.safeExit);
        // catches Ctrl + C exits
        process.on('SIGINT', this._handlers.exitHandlers.killedExit);
        // catches "kill pid" (for example: nodemon restart)
        process.on('SIGUSR1', this._handlers.exitHandlers.killedExit);
        process.on('SIGUSR2', this._handlers.exitHandlers.killedExit);
        // // Handle termination signals (SIGTERM, SIGBREAK on Windows)
        process.on('SIGTERM', this._handlers.exitHandlers.killedExit);
        process.on('SIGHUP', this._handlers.exitHandlers.killedExit);
        nasriya_cron_1.default.schedule(nasriya_cron_1.default.time.every(1).minutes(), this._handlers.writeLogs, { name: 'LogifyWriting', runOnInit: true });
    }
    _handlers = {
        exitHandlers: {
            safeExit: (code) => {
                console.info(`Logify is closing...\nExitting with code: ${code}`);
            },
            killedExit: async () => {
                console.clear();
                console.info('Logify is cleaning up...');
                const task = nasriya_cron_1.default.getTask('LogifyWriting');
                if (task) {
                    task.stop();
                }
                await this._handlers.writeLogs();
                process.exit(0);
            }
        },
        writeLogs: () => {
            return new Promise((resolve, reject) => {
                if (this._logs.length === 0) {
                    return;
                }
                const writeLogs = [...this._logs]; // Copy the logs to the write queue;
                this._logs = []; // Reset the logs;
                // Create the write stream
                const writeStream = fs_1.default.createWriteStream(fileSystem_1.default._logFileLocation, { flags: 'a', highWaterMark: 1024 * 1024 });
                writeStream.on('close', resolve);
                writeStream.on('error', reject);
                const diver = '#'.repeat(100);
                // Initializing the logs to be written
                for (const log of writeLogs) {
                    const entry = `Request ID: ${log._id} - ${log.time} -${log.data instanceof AppError_1.default && typeof log.data.httpCode === 'number' ? ` Status Code: ${log.data.httpCode} -` : ''} ${log.message}`;
                    fileSystem_1.default.write(entry, writeStream);
                    if (!helpers_1.default.isUndefined(log.data)) {
                        if (log.data instanceof AppError_1.default) {
                            const error = log.data;
                            if (typeof error.stack === 'string') {
                                fileSystem_1.default.write(error.stack, writeStream);
                            }
                            if (helpers_1.default.isRealObject(error.flags)) {
                                fileSystem_1.default.write(`\nFlags:\n${JSON.stringify(error.flags, null, 4)}`, writeStream);
                            }
                            if (helpers_1.default.isRealObject(error.data)) {
                                fileSystem_1.default.write(`Error Data:\n${JSON.stringify(error.data, null, 4)}`, writeStream);
                            }
                            fileSystem_1.default.write(diver, writeStream);
                        }
                        else if (helpers_1.default.isRealObject(log.data)) {
                            fileSystem_1.default.write(`Data:\n${JSON.stringify(log.data, null, 4)}`, writeStream);
                        }
                        else if (typeof log.data === 'string' || typeof log.data === 'number') {
                            fileSystem_1.default.write(log.data.toString(), writeStream);
                        }
                    }
                }
                writeStream.close();
            });
        }
    };
    _utils = {
        isErrorSeverity: (arg) => {
            if (helpers_1.default.isValidString(arg)) {
                if (arg === 'High' || arg === 'Medium' || arg === 'Low') {
                    return true;
                }
            }
            return false;
        }
    };
    /**
     * Log something to the console.
     * @param data The data to be logged, it can be anything.
     */
    log(data, type = 'Log') {
        const cache = { log: null };
        if (typeof data === 'string' || typeof data === 'number') {
            cache.log = {
                _id: helpers_1.default.generateRandom(32, { includeSymbols: false }),
                message: data.toString(),
                time: new Date().toISOString(),
                type: helpers_1.default.isLogType(type) ? type : 'Log'
            };
        }
        else if (data instanceof AppError_1.default) {
            cache.log = {
                _id: data._id,
                time: data.time,
                message: `${data.name}: ${data.message}`,
                type: 'Error',
                data: data,
            };
        }
        else {
            // Handle other types of data here
            cache.log = {
                _id: helpers_1.default.generateRandom(32, { includeSymbols: false }),
                message: JSON.stringify(data),
                time: new Date().toISOString(),
                type: helpers_1.default.isLogType(type) ? type : 'Log'
            };
        }
        this._logs.push(cache.log);
        // @ts-ignore
        console[type.toLowerCase()](cache.log);
    }
}
exports.default = LogifyLogger;
