// hoffy.mjs
import { readFile } from 'fs/promises'; // Importing the file system promises API for reading to a file

/**
 * Returns all parameters at even indices.
 * @param  {...any} args - The arguments to filter.
 * @returns {Array} - Array of arguments at even indices.
 */
export function getEvenParam(...args) {
    return args.filter((_, index) => index % 2 === 0);
}

/**
 * Takes a function and returns a new function that returns undefined 
 * if any of the arguments passed to it are null or undefined.
 * @param {Function} fn - The function to wrap.
 * @returns {Function} - New function that returns undefined if any argument is null or undefined.
 */
export function maybe(fn) {
    return function(...args) {
        if (args.some(arg => arg === null || arg === undefined)) { // Use strict equality noted in eslint
            return undefined;
        }
        return fn(...args);
    };
}

/**
 * Returns a new function that filters an array using the provided function.
 * @param {Function} fn - The filtering function.
 * @returns {Function} - New function that filters an array.
 */
export function filterWith(fn) {
    return function(arr) {
        return arr.filter(fn);
    };
}

/**
 * Calls the provided function n times with the provided argument.
 * @param {Function} fn - The function to call.
 * @param {number} n - The number of times to call the function.
 * @param {any} arg - The argument to pass to the function.
 */
export function repeatCall(fn, n, arg) {
    for (let i = 0; i < n; i++) {
        fn(arg);
    }
}

/**
 * Limits the number of times a function can be called.
 * @param {Function} fn - The function to limit.
 * @param {number} n - The maximum number of times the function can be called.
 * @returns {Function} - New function that can only be called up to n times.
 */
export function limitCallsDecorator(fn, n) {
    let count = 0;
    return function(...args) {
        if (count < n) {
            count++;
            return fn(...args);
        }
        return undefined;
    };
}

/**
 * Reads a file and calls success or error function based on the result.
 * @param {string} fileName - The name of the file to read.
 * @param {Function} successFn - The function to call on success.
 * @param {Function} errorFn - The function to call on error.
 */
export async function myReadFile(fileName, successFn, errorFn) {
    try {
        const data = await readFile(fileName, 'utf-8');
        successFn(data);
    } catch (err) {
        errorFn(err);
    }
}

/**
 * Converts rows and headers into an array of objects.
 * @param {Object} data - The data containing headers and rows.
 * @returns {Object[]} - Array of objects created from headers and rows.
 */
export function rowsToObjects(data) {
    return data.rows.map(row => {
        return row.reduce((obj, val, index) => {
            obj[data.headers[index]] = val;
            return obj;
        }, {});
    });
}
