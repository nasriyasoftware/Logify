import helpers from '../../utils/helpers';
import nasriyaCron from 'nasriya-cron';
import fileSystem from '../../utils/fileSystem';
import AppError from '../errors/assets/AppError';
import fs from 'fs';
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
        nasriyaCron.schedule(nasriyaCron.time.every(1).minutes(), this._handlers.writeLogs, { name: 'LogifyWriting', runOnInit: true });
    }
    _handlers = {
        exitHandlers: {
            safeExit: (code) => {
                console.info(`Logify is closing...\nExitting with code: ${code}`);
            },
            killedExit: async () => {
                console.clear();
                console.info('Logify is cleaning up...');
                const task = nasriyaCron.getTask('LogifyWriting');
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
                const writeStream = fs.createWriteStream(fileSystem._logFileLocation, { flags: 'a', highWaterMark: 1024 * 1024 });
                writeStream.on('close', resolve);
                writeStream.on('error', reject);
                const diver = '#'.repeat(100);
                // Initializing the logs to be written
                for (const log of writeLogs) {
                    const entry = `Request ID: ${log._id} - ${log.time} -${log.data instanceof AppError && typeof log.data.httpCode === 'number' ? ` Status Code: ${log.data.httpCode} -` : ''} ${log.message}`;
                    fileSystem.write(entry, writeStream);
                    if (!helpers.isUndefined(log.data)) {
                        if (log.data instanceof AppError) {
                            const error = log.data;
                            if (typeof error.stack === 'string') {
                                fileSystem.write(error.stack, writeStream);
                            }
                            if (helpers.isRealObject(error.flags)) {
                                fileSystem.write(`\nFlags:\n${JSON.stringify(error.flags, null, 4)}`, writeStream);
                            }
                            if (helpers.isRealObject(error.data)) {
                                fileSystem.write(`Error Data:\n${JSON.stringify(error.data, null, 4)}`, writeStream);
                            }
                            fileSystem.write(diver, writeStream);
                        }
                        else if (helpers.isRealObject(log.data)) {
                            fileSystem.write(`Data:\n${JSON.stringify(log.data, null, 4)}`, writeStream);
                        }
                        else if (typeof log.data === 'string' || typeof log.data === 'number') {
                            fileSystem.write(log.data.toString(), writeStream);
                        }
                    }
                }
                writeStream.close();
            });
        }
    };
    _utils = {
        isErrorSeverity: (arg) => {
            if (helpers.isValidString(arg)) {
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
                _id: helpers.generateRandom(32, { includeSymbols: false }),
                message: data.toString(),
                time: new Date().toISOString(),
                type: helpers.isLogType(type) ? type : 'Log'
            };
        }
        else if (data instanceof AppError) {
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
                _id: helpers.generateRandom(32, { includeSymbols: false }),
                message: JSON.stringify(data),
                time: new Date().toISOString(),
                type: helpers.isLogType(type) ? type : 'Log'
            };
        }
        this._logs.push(cache.log);
        // @ts-ignore
        console[type.toLowerCase()](cache.log);
    }
}
export default LogifyLogger;
