"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    /**
     * Check if the argument is a real object or not
     * @param {*} obj
     * @returns {boolean}
     */
    isRealObject(obj) {
        return typeof obj === 'object' && obj !== null && !(obj instanceof Array) && !(obj instanceof Date) && !(obj instanceof RegExp) && !(obj instanceof Error);
    }
    /**
     * Check whether the argument is a valid string or not
     * @param {*} str
     * @returns {boolean}
     */
    isValidString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }
    /**
     * Check if the value is undefined
     * @param {any} arg
     * @returns {boolean}
     */
    isUndefined(arg) {
        return typeof arg === 'undefined';
    }
    isLogType(arg) {
        if (typeof arg !== 'string') {
            return false;
        }
        return ['Error', 'Warn', 'Info', 'Log', 'Assert', 'Debug', 'Dir', 'Table', 'Trace'].includes(arg);
    }
    /**
     * Generate a random text
     * @param length The length of the text. Minimum of `4`
     * @param [options] Options for generating the text
     * @returns
     */
    generateRandom(length, options = {}) {
        const { includeNumbers = true, includeLetters = true, includeSymbols = true, includeLowerCaseChars = true, includeUpperCaseChars = true, beginWithLetter = true, noSimilarChars = true, noDuplicateChars = false, noSequentialChars = true } = options;
        let chars = '';
        let text = '';
        if (includeNumbers)
            chars += '0123456789';
        if (includeLetters) {
            if (includeLowerCaseChars)
                chars += 'abcdefghijklmnopqrstuvwxyz';
            if (includeUpperCaseChars)
                chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (includeSymbols)
            chars += '!";#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
        if (beginWithLetter && (includeLetters || includeNumbers || includeSymbols)) {
            const validChars = includeLetters && includeNumbers && includeSymbols ? chars : chars.slice(10);
            text += validChars.charAt(Math.floor(Math.random() * validChars.length));
        }
        while (text.length < length) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            const char = chars[randomIndex];
            if ((noSimilarChars && /[il1LoO]/.test(char)) ||
                (noDuplicateChars && text.includes(char)) ||
                (noSequentialChars && text.length > 0 && text[text.length - 1].charCodeAt(0) + 1 === char.charCodeAt(0))) {
                continue;
            }
            text += char;
        }
        return text;
    }
}
exports.default = new Helpers;
