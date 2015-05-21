// Karma configuration
module.exports = function (config) {

    'use strict';

    var
        // Here we define an Object that we will use for `lodash` templating.
        stamp = {
            'env' : require('detect-environment')(),
            'pkg' : require('./package.json')
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
                'pattern'  : 'vendor/**/*.js',
                'included' : false
            },
            {
                'pattern'  : 'typings/**/*.d.ts',
                'included' : false
            },
            {
                'pattern'  : 'src/ts/app/**/*.ts',
                'included' : false
            },
            {
                'pattern'  : 'src/ts/app.ts',
                'included' : false
            },
            {
                'pattern'  : 'tests/specs/src/ts/**/*.spec.ts',
                'included' : false
            },
            {
                'pattern'  : 'src/ts/main.config.ts',
                'included' : true
            },
            {
                'pattern'  : 'tests/karma.main.ts',
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
            'karma-requirejs',
            'karma-typescript-preprocessor'
        ],

        // web server port
        'port' : 9876,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        'preprocessors' : {
            'src/ts/**/*.ts' : ['lodash', 'typescript', 'coverage'],
            'tests/**/*.ts'  : ['lodash', 'typescript']
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

        // typescript preprocessor
        // https://github.com/sergeyt/karma-typescript-preprocessor
        // options to be passed to the typescript compiler
        'typescriptPreprocessor' : {
            'options' : {
                'module'         : 'amd',
                'noImplicitAny'  : true,
                'noResolve'      : false,
                'removeComments' : true,
                'sourceMap'      : false,
                'target'         : 'es5'
            },
            'transformPath' : function (path) {
                return path.replace(/\.ts$/, '.js');
            }
        },

        // coverage reporter
        // https://github.com/karma-runner/karma-coverage
        // configure the where we want the report to be saved
        'coverageReporter' : {
            'dir'       : 'coverage',
            'reporters' : [
                {
                    'type'   : 'lcov',
                    'subdir' : 'lcov'
                },
                {
                    'type' : 'html'
                },
                {
                    'type' : 'text-summary'
                }
            ]
        }

    });

};

/* vim: set cc=0 : */
