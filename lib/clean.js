'use strict';

var
    // Pull in the `del` module to delete the globs.
    del = require('del'),

    // Pull in `log` for the colourful logging.
    log = require('./log'),

    /**
     * @name whitneyit.lib.clean
     *
     * @description
     * Cleans a "glob" and logs a message to the console.
     *
     * @throws {TypeError} - `glob` must be either a String or an Array.
     * @throws {TypeError} - `name` must be a truthy String.
     * @throws {TypeError} - `done` must be a Function.
     * @throws {Error}     - `del` encountered an Error.
     *
     * @param {Array|String} glob   - The pattern of files/dirs to delete.
     * @param {String}       [name] - The "name" of the glob to log.
     * @param {Function}     done   - The gulp task callback.
     *
     * @return {Void}
     */
    clean = function clean (glob, name, done) {

        // Curry the `glob` String into an Array.
        if (typeof glob === 'string') {
            glob = [glob];
        }

        // Ensure that `argv` is an Array.
        if (!Array.isArray(glob)) {
            throw new TypeError('Expected `glob` to be a String or an Array');
        }

        // Curry the `name` Function into `done`.
        if (typeof name === 'function') {
            done = name;
            name = glob[0];
        }

        // Ensure that we a have a valid String.
        if (!name || typeof name !== 'string') {
            throw new TypeError('Expected `name` to be a String');
        }

        // Ensure that we a have a valid Function.
        if (typeof done !== 'function') {
            throw new TypeError('Expected `done` to be a Function');
        }

        // Delete the `glob` and wait for the async callback.
        del(glob, function (err) {

            // Throw if `del` encountered an Error.
            if (err) {
                throw err;
            }

            // Log our to the console what we just deleted.
            log.info('Cleaned the "' + name + '" directory.');

            // Execute the `gulp callback`.
            done();

        });

    };

// Expose to node.
module.exports = clean;
