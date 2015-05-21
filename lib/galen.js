'use strict';

var
    //
    spawn = require('child_process').spawn,

    /**
     * @name whitneyit.lib.galen
     *
     * @description
     * Lorem
     *
     * @type {Boolean}
     */
    galen = function galen (path, dest, done) {
        spawn('galen', [
            'test',
            path,
            '--htmlreport',
            dest
        ], {'stdio' : 'inherit'}).on('close', function () {
            done();
        });
    };

// Expose to node.js
module.exports = galen;
