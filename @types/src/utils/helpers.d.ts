import { LogType } from '../../../src/docs/docs';

declare class Helpers {
    /**
     * Check if the argument is a real object or not
     * @param {*} obj 
     * @returns {boolean}
     */
    isRealObject(obj: any): boolean;

    /**
     * Check whether the argument is a valid string or not
     * @param {*} str 
     * @returns {boolean}
     */
    isValidString(str: any): boolean;

    /**
     * Check if the value is undefined
     * @param {any} arg 
     * @returns {boolean}
     */
    isUndefined(arg: any): arg is undefined;

    isLogType(arg: any): arg is LogType;

    /**
     * Generate a random text
     * @param length The length of the text. Minimum of `4`
     * @param [options] Options for generating the text
     * @returns 
     */
    generateRandom(length: number, options?: RandomOptions): string;
}

export default Helpers;

interface RandomOptions {
    /** Include numbers. Default: `true` */
    includeNumbers?: boolean;
    /** Include letters. Default: `true` */
    includeLetters?: boolean;
    /** Include symbols: ``!";#$%&'()*+,-./:;<=>?@[]^_`{|}~``. Default: `true` */
    includeSymbols?: boolean;
    /** Include lowercase characters. Default: `true` */
    includeLowerCaseChars?: boolean;
    /** Include uppercase characters. Default: `true` */
    includeUpperCaseChars?: boolean;
    /** Don't begin with a number or symbol. Default: `true` */
    beginWithLetter?: boolean;
    /** Don't use characters like i, l, 1, L, o, 0, O, etc. Default: `true` */
    noSimilarChars?: boolean;
    /** Don't use the same character more than once. Default: `false` */
    noDuplicateChars?: boolean;
    /** Don't use sequential characters, e.g. `abc`, `789`. Default: `true` */
    noSequentialChars?: boolean;
}
