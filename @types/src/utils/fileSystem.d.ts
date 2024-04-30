import { WriteStream } from 'fs';

declare class FileSystemManager {
    write(chunk: string, stream: WriteStream): void;
    get _logFolderLocation(): string;
    get _logFileLocation(): string;
}

export default FileSystemManager;