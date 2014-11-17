'use strict';

var
    // Here we use the `serve-index` module to act as our middleware.
    index = require('serve-index'),

    /**
     * @name whitneyit.lib.middule#options
     *
     * @description
     * Options to be passed to `serve-index`. For more info check out:
     * https://github.com/whitneyit/whitneyit.github.io/commits/master
     *
     * @property {Boolean} filter     - Filter to apply to files.
     * @property {Boolean} hidden     - Whether or not to show hidden files.
     * @property {Boolean} icons      - Displays icons for files.
     * @property {Boolean} stylesheet - Custom stylesheet to be applied.
     * @property {Boolean} template   - Custom template to use.
     * @property {String}  view       - What style of directory listing to use.
     */
    options = {
        'filter'     : false,
        'hidden'     : true,
        'icons'      : true,
        'stylesheet' : false,
        'template'   : false,
        'view'       : 'details'
    },

    /**
     * @name whitneyit.lib.middle
     *
     * @description
     * Defines a Function that accepts a directory and returns a "middleware".
     *
     * A middlware is simply a Function that handles requests. The middlware
     * that we are using, `serve-index` just returns a directory listing for
     * requests that would otherwise not do so, typicially where you would see
     * a 403 request forbidden response.
     *
     * For more information on middlewares, check out:
     * http://stephensugden.com/middleware_guide/
     *
     * @throws {TypeError} `directory` must be a truthy String.
     *
     * @param {String} directory - The directory index to be served.
     *
     * @return {Function} - The middleware to be consumed by `connect`.
     */
    middle = function middle (directory) {

        // Ensure that we a have a valid String.
        if (!directory || typeof directory !== 'string') {
            throw new TypeError('Expected `directory` to be a String');
        }

        // Here we return our middleware Function. It simply proxies each of the
        // requests through to the `serve-index` module.
        return function (req, res, done) {
            return index(directory, options)(req, res, done);
        };

    };

// Expose to node.
module.exports = middle;
