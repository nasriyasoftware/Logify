"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileSystemManager {
    _eventEmitter = new events_1.default();
    _logLocation = path_1.default.join(process.cwd(), 'logs');
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
                fs_1.default.access(location, fs_1.default.constants.R_OK | fs_1.default.constants.W_OK, (err) => {
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
            const yearLocation = path_1.default.join(this._logLocation, year);
            const monthLocation = path_1.default.join(yearLocation, month);
            const dateLocation = path_1.default.join(monthLocation, date);
            const logFilePath = path_1.default.join(dateLocation, `${this._utils.getTodaysLogFileName()}.log`);
            // Create the logs folder if it doesn't exist
            if (!fs_1.default.existsSync(this._logLocation)) {
                try {
                    fs_1.default.mkdirSync(this._logLocation);
                    // console.log(`Created folder: ${logsFolderLocation}`);
                }
                catch (err) {
                    console.error(`Error creating folder: ${this._logLocation}`, err);
                    return;
                }
            }
            // Create the directory structure if it doesn't exist
            if (!fs_1.default.existsSync(dateLocation)) {
                try {
                    fs_1.default.mkdirSync(dateLocation, { recursive: true });
                    fs_1.default.writeFileSync(logFilePath, '', { flag: 'wx' });
                }
                catch (err) {
                    console.error(`Error creating folder: ${dateLocation}`, err);
                    throw err;
                }
            }
            else {
                // Check if the log file exists
                if (!fs_1.default.existsSync(logFilePath)) {
                    try {
                        fs_1.default.writeFileSync(logFilePath, '', { flag: 'wx' });
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
        return path_1.default.join(this._logFolderLocation, year, _month, _date, `${this._utils.getTodaysLogFileName()}.log`);
    }
}
exports.default = new FileSystemManager();
