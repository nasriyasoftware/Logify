/// <reference types="node" />
import { WriteStream } from 'fs';
declare class FileSystemManager {
    private readonly _eventEmitter;
    private _logLocation;
    constructor();
    private readonly _utils;
    /**Write a chunk of data to today's log file */
    write(chunk: string, stream: WriteStream): void;
    get _logFolderLocation(): string;
    get _logFileLocation(): string;
}
declare const _default: FileSystemManager;
export default _default;
