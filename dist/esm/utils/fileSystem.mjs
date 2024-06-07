import EventEmitter from "events";
import fs from 'fs';
import path from "path";
class FileSystemManager {
    _eventEmitter = new EventEmitter();
    _logLocation = path.join(process.cwd(), 'logs');
    constructor() {
        this._eventEmitter.on('LogifyLogLocationChange', async (newLocation) => {
            console.log('Log location event has been recieved to:', newLocation);
            const hasAccess = await this._utils.hasRWAccess(newLocation);
            if (hasAccess) {
                this._logLocation = newLocation;
            }
        });
    }
    _utils = {
        hasRWAccess: (location) => {
            return new Promise((resolve, reject) => {
                fs.access(location, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                    if (err) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        },
        checkTodaysFolder: () => {
            const { year, month, date } = this._utils.getTodaysLogFileName('Object');
            const yearLocation = path.join(this._logLocation, year);
            const monthLocation = path.join(yearLocation, month);
            const dateLocation = path.join(monthLocation, date);
            const logFilePath = path.join(dateLocation, `${this._utils.getTodaysLogFileName()}.log`);
            // Create the logs folder if it doesn't exist
            if (!fs.existsSync(this._logLocation)) {
                try {
                    fs.mkdirSync(this._logLocation);
                    // console.log(`Created folder: ${logsFolderLocation}`);
                }
                catch (err) {
                    console.error(`Error creating folder: ${this._logLocation}`, err);
                    return;
                }
            }
            // Create the directory structure if it doesn't exist
            if (!fs.existsSync(dateLocation)) {
                try {
                    fs.mkdirSync(dateLocation, { recursive: true });
                    fs.writeFileSync(logFilePath, '', { flag: 'wx' });
                }
                catch (err) {
                    console.error(`Error creating folder: ${dateLocation}`, err);
                    throw err;
                }
            }
            else {
                // Check if the log file exists
                if (!fs.existsSync(logFilePath)) {
                    try {
                        fs.writeFileSync(logFilePath, '', { flag: 'wx' });
                    }
                    catch (err) {
                        console.error(`Error creating file: ${logFilePath}`, err);
                        throw err;
                    }
                }
            }
        },
        getTodaysLogFileName: (as) => {
            const now = new Date();
            const year = now.getUTCFullYear().toString();
            const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
            const date = now.getUTCDate().toString().padStart(2, '0');
            if (typeof as !== 'undefined') {
                if (typeof as === 'string') {
                    if (as === 'Object') {
                        return { year, month, date };
                    }
                }
                else {
                    throw new Error(`The "getTodaysLogFileName" parameter only accepts string values, but instead got ${typeof as}`);
                }
            }
            return `${year}-${month}-${date}`;
        }
    };
    /**Write a chunk of data to today's log file */
    write(chunk, stream) {
        try {
            this._utils.checkTodaysFolder();
            stream.write(`\n${chunk}`);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    get _logFolderLocation() {
        this._utils.checkTodaysFolder();
        return this._logLocation;
    }
    get _logFileLocation() {
        const { year, month, date } = this._utils.getTodaysLogFileName('Object');
        const _month = month.padStart(2, '0');
        const _date = date.padStart(2, '0');
        return path.join(this._logFolderLocation, year, _month, _date, `${this._utils.getTodaysLogFileName()}.log`);
    }
}
export default new FileSystemManager();
