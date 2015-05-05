'use strict';

var
    // Grab any system packages.
    extend = require('util')._extend,
    path   = require('path'),

    /**
     * @name whitneyit.lib.dataFn
     *
     * @description
     * Returns a handler Function to be consumed by `gulp-data`.
     *
     * The `gulp-data` plugin accepts a callback and this lib is used to do just
     * that. The callback is then invoked and passed along a `vinylObj`. This
     * Object is an instance of the `File` class. More information about `vinyl`
     * Objects can be found at https://github.com/wearefractal/vinyl.
     *
     * The callback then returns a handler that will be invoked for each File in
     * the Stream. The return of this handler then adds data to the steam via
     * `gulp-data`. This data is stored on the Stream and is accessible via the
     * `gulp-template` plugin.
     *
     * The template plugin will read the data found on the stream and then
     * stamp out the contents should they be requested.
     *
     * We extend the `dataObj` that is passed in, the intended Object to be
     * stamped out to the file in question, with additional "file" data. This
     * data can the be accessed by the following.
     *
     * ```html
     * <!-- Given file "foo/bar.html" -->
     * <title><%= file.dir %><%= file.name %></title>
     * <!-- <title>foo/bar.html</title> -->
     * ```
     *
     * @param {Object} dataObj - An Object to stamp out to a file.
     *
     * @return {Function} - A handler to be invoked by `gulp-data`.
     */
    dataFn = function dataFn (dataObj) {
        return function (vinylObj) {
            return extend(dataObj, {
                'file' : {
                    'name' : path.basename(vinylObj.path),
                    'dir'  : path.normalize(path.dirname(vinylObj.path).substr(vinylObj.cwd.length + 1) + '/')
                }
            });
        };
    };

// Expose to node.
module.exports = dataFn;
