// Karma configuration
module.exports = function (config) {

    'use strict';

    var
        // Grab the `package.json` file.
        pkg = require('./package.json'),

        // Here we define an Object that we will use for `lodash` templating.
        stamp = {
            'pkg' : pkg
        };

    // Configure `karma`.
    config.set({

        // enable / disable watching file and executing tests whenever any file changes
        'autoWatch' : false,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        'basePath' : '',

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        'browsers' : ['PhantomJS'],

        // Here we define the maximum bootup time for a browser
        'captureTimeout' : 10000,

        // enable / disable colors in the output (reporters and logs)
        'colors' : true,

        // list of files to exclude
        'exclude' : [],

        // list of files / patterns to load in the browser
        'files' : [
            {
                'pattern'  : 'bower_components/**/*.js',
                'included' : false
            },
            {
                'pattern'  : 'src/**/*.js',
                'included' : false
            },
            {
                'pattern'  : 'tests/specs/**/*.spec.js',
                'included' : false
            },
            {
                'pattern'  : 'tests/fixtures/karma.fixture.js',
                'included' : true
            }
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        'frameworks' : ['jasmine', 'requirejs'],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        'logLevel' : config.LOG_INFO,

        // the plugins for karma to load
        'plugins' : [
            'karma-coverage',
            'karma-jasmine',
            'karma-lodash-template-preprocessor',
            'karma-phantomjs-launcher',
            'karma-requirejs'
        ],

        // web server port
        'port' : 9876,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        'preprocessors' : {
            '**/*.js'     : ['lodash'],
            'src/**/*.js' : ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        'reporters' : ['progress', 'coverage'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        'singleRun' : false,

        ////////////////////////////////////////
        //                                    //
        //              PLUGINS               //
        //                                    //
        ////////////////////////////////////////

        // lodash preprocessor
        // https://github.com/deltaidea/karma-lodash-template-preprocessor
        // the `stamp` Object is what variables will be exposed to the templates
        'lodashPreprocessor' : {
            'data' : stamp
        },

        // coverage reporter
        // https://github.com/karma-runner/karma-coverage
        // configure the where we want the report to be saved
        'coverageReporter' : {
            'dir'  : 'coverage',
            'type' : 'html'
        }

    });

};

/* vim: set cc=0 : */
