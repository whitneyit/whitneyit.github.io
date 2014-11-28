'use strict';

var
    // Pull in `chalk` for the colourful logging.
    chalk = require('chalk'),

    // Pull in `gutil` so that our logs are timestamped.
    gutil = require('gulp-util'),

    /**
     * @name whitneyit.lib.log
     *
     * @description
     * Logs a "blue" message to the console.
     *
     * @param {String} msg - The message to log.
     *
     * @return {Void}
     */
    log = function log (msg) {
        info(msg);
    },

    /**
     * @name whitneyit.lib.log#err
     *
     * @description
     * Logs a "red" message to the console.
     *
     * @param {String} msg - The message to log.
     *
     * @return {Void}
     */
    err = function err (msg) {
        gutil.log(chalk.red(msg));
    },

    /**
     * @name whitneyit.lib.log#info
     *
     * @description
     * Logs a "blue" message to the console.
     *
     * @param {String} msg - The message to log.
     *
     * @return {Void}
     */
    info = function info (msg) {
        gutil.log(chalk.blue(msg));
    };

// Attach the utility loggers.
log.err  = err;
log.info = info;

// Expose to node.
module.exports = log;
