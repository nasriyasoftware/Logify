"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./assets/AppError"));
class ErrorsManager {
    _eventEmitter;
    constructor(eventEmitter) {
        this._eventEmitter = eventEmitter;
    }
    /**
     * Create a new `AppError`. This is a generic error.
     *
     * **Example**
     * ```ts
     * import logify from 'nasriya-logify';
     *
     * throw logify.errors.AppError({ name: 'PaymentError', description: 'Something went wrong' })
     * ```
     */
    AppError(options) {
        return new AppError_1.default(options, this._eventEmitter);
    }
}
exports.default = ErrorsManager;
