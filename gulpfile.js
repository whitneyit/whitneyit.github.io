'use strict';

var
    // Grab any system packages.
    fs         = require('fs'),
    spawn      = require('child_process').spawn,

    // Grab the `package.json` file.
    pkg        = require('./package.json'),

    // Grab any packages they we have written.
    argToBool  = require('./lib/argToBool'),
    clean      = require('./lib/clean'),
    dataFn     = require('./lib/dataFn'),
    galen      = require('./lib/galen'),
    isBranch   = require('./lib/isBranch'),
    log        = require('./lib/log'),
    middle     = require('./lib/middle'),

    // Grab our non gulp packages.
    async      = require('async'),
    de         = require('detect-environment'),
    del        = require('del'),
    psi        = require('psi'),
    yaml       = require('js-yaml').safeLoad,
    yargs      = require('yargs'),

    // Grab gulp and its plugins.
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),

    // Grab the other gulp plugins.
    chmod      = require('gulp-chmod'),
    concat     = require('gulp-concat'),
    csslint    = require('gulp-csslint'),
    cssmin     = require('gulp-cssmin'),
    data       = require('gulp-data'),
    eslint     = require('gulp-eslint'),
    gif        = require('gulp-if'),
    gfilter    = require('gulp-filter'),
    gzip       = require('gulp-gzip'),
    header     = require('gulp-header'),
    image      = require('gulp-image'),
    footer     = require('gulp-footer'),
    jscs       = require('gulp-jscs'),
    jsonlint   = require('gulp-jsonlint'),
    karma      = require('gulp-karma'),
    order      = require('gulp-order'),
    rename     = require('gulp-rename'),
    sass       = require('gulp-sass'),
    serve      = require('gulp-serve'),
    size       = require('gulp-size'),
    tap        = require('gulp-tap'),
    tmpl       = require('gulp-template'),
    ts         = require('gulp-typescript'),
    uglify     = require('gulp-uglify'),

    // Grab the config files our build task depends upon.
    args = yaml(fs.readFileSync('build/config/yargs-aliases.yml')),

    // Define our cli argument aliases.
    argv = yargs.alias(args).argv,

    // Determine the environment and grab the `envData`.
    env = de(function (envName) {
        if (fs.existsSync('/home/travis')) {
            log.info('Travis detected. Setting environment to "testing"');
            return 'testing';
        }
        var task = argv._[0];
        switch (argv._[0]) {
            case 'psi':
            case 'release':
                log.info('Task "' + task + '" detected. Setting environment to "production"');
                return 'production';
        }
        return envName;
    }),

    // Grab our "wrapping" files to be used by `gulp-header` and `gulp-footer`.
    banner = fs.readFileSync('build/include/banner.txt'),
    head   = fs.readFileSync('build/include/head.js'),
    foot   = fs.readFileSync('build/include/foot.js'),

    // The port to be used when serving directories
    port = 3333,

    // Here we stub out an Object to use in `lodash` templating.
    stamp = {
        'env'  : env,
        'file' : {},
        'pkg'  : pkg
    },

    // Configure the `gulp-typescript` plugin.
    tsProject = ts.createProject({
        'declarationFiles'  : false,
        'module'            : 'amd',
        'noExternalResolve' : false,
        'noImplicitAny'     : true,
        'noLib'             : false,
        'removeComments'    : true,
        'sortOutput'        : true,
        'target'            : 'es5'
    });

// Convert the some arguments to Booleans.
argv.clean  = argToBool(argv, 'clean');
argv.debug  = argToBool(argv, 'debug');
argv.force  = argToBool(argv, 'force');
argv.gzip   = argToBool(argv, 'gzip');
argv.minify = argToBool(argv, 'minify');

// If we are in a production environment, override some arguments.
if (env.base) {
    argv.debug  = false;
    argv.minify = true;
}

////////////////////////////////////////
//                                    //
//               Cleans               //
//                                    //
////////////////////////////////////////

// Cleans the `assets` directory.
gulp.task('clean:assets', function (done) {
    clean('assets', done);
});

// Cleans the `coverage` directory.
gulp.task('clean:coverage', function (done) {
    clean('coverage', done);
});

// Cleans the `dist` directory.
gulp.task('clean:dist', function (done) {
    clean('dist', done);
});

// Cleans the `dist/img` directory.
gulp.task('clean:dist:img', function (done) {
    clean('dist/img', done);
});

// Cleans the `dist/bower` directory.
gulp.task('clean:dist:bower', function (done) {
    clean('dist/bower', done);
});

// Cleans the `dist/bower/angular` directory.
gulp.task('clean:dist:bower:angular', function (done) {
    clean('dist/bower/angular', done);
});

// Cleans the `dist/bower/jquery` directory.
gulp.task('clean:dist:bower:jquery', function (done) {
    clean('dist/bower/jquery', done);
});

// Cleans the `dist/bower/requirejs` directory.
gulp.task('clean:dist:bower:requirejs', function (done) {
    clean('dist/bower/requirejs', done);
});

// Cleans the `dist/media` directory.
gulp.task('clean:dist:media', function (done) {
    clean('dist/media', done);
});

// Cleans the `dist/css` directory.
gulp.task('clean:dist:css', function (done) {
    clean('dist/css', done);
});

// Cleans the `dist/js` directory.
gulp.task('clean:dist:js', function (done) {
    clean('dist/js', done);
});

// Cleans the `dist/vendor` directory.
gulp.task('clean:dist:vendor', function (done) {
    clean('dist/vendor', done);
});

// Cleans the `docs` directory.
gulp.task('clean:docs', function (done) {
    clean('docs', done);
});

// Cleans the `reports` directory.
gulp.task('clean:reports', function (done) {
    clean('reports', done);
});

// Cleans the `root` directory.
gulp.task('clean:root', function (done) {
    clean([
        'favicon.ico',
        'humans.txt',
        'index.html',
        'robots.txt'
    ], 'root', done);
});

// Cleans the asset subdirectories.
gulp.task('clean:dist:bower:all', [
    'clean:dist:bower:angular',
    'clean:dist:bower:jquery',
    'clean:dist:bower:requirejs'
]);

// Cleans the asset subdirectories.
gulp.task('clean:dist:all', [
    'clean:dist:css',
    'clean:dist:img',
    'clean:dist:js',
    'clean:dist:bower',
    'clean:dist:media',
    'clean:dist:vendor'
]);

// Cleans all other directories.
gulp.task('clean', [
    'clean:coverage',
    'clean:dist',
    'clean:docs',
    'clean:reports',
    'clean:root'
]);

////////////////////////////////////////
//                                    //
//               Builds               //
//                                    //
////////////////////////////////////////

// Pre-processes our image files.
gulp.task('build:img', ['clean:dist:img'], function () {
    return gulp.src(['src/img/**/*'])
        .pipe(gif(argv.minify, image()))
        .pipe(chmod(755))
        .pipe(gulp.dest('dist/img'));
});

// Pre-processes our SCSS files.
gulp.task('build:scss', ['clean:dist:css'], function () {
    var
        f1 = gfilter(['**/normalize.css']),
        f2 = gfilter(['**/normalize.css']),
        f3 = gfilter(['*', '!**/normalize.css']);
    return gulp.src(['bower_components/normalize.css/normalize.css', 'src/scss/main.scss'])
        .on('error', gutil.log)
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(chmod(755))
        .pipe(f1)
        .pipe(cssmin({
            'keepSpecialComments' : 0
        }))
        .pipe(f1.restore())
        .pipe(sass({
            'includePaths' : ['src/scss'],
            'outputStyle'  : 'nested'
        }))
        .pipe(gif(argv.minify, cssmin({
            'keepSpecialComments' : 1
        })))
        .pipe(f2)
        .pipe(header('/*!\n * normalize.css v3.0.2 | MIT License | git.io/normalize\n */\n'))
        .pipe(f2.restore())
        .pipe(f3)
        .pipe(header((argv.minify ? '\n' : '') + banner, stamp))
        .pipe(f3.restore())
        .pipe(order([
            '**/normalize.css',
            '*'
        ]))
        .pipe(concat('whitneyit.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(size({
            'showFiles' : true
        }));
});

// Pre-processes our `app.js` file.
gulp.task('build:ts:app', ['build:ts:main'], function () {
    return gulp.src(['src/ts/app.ts'])
        .on('error', gutil.log)
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(ts(tsProject))
        .js
        .pipe(chmod(755))
        .pipe(gif(argv.minify, uglify({
            'preserveComments' : 'some'
        })))
        .pipe(gif(argv.gzip, gzip({
            'append' : false
        })))
        .pipe(gulp.dest('dist/js'))
        .pipe(size({
            'showFiles' : true
        }));
});

// Pre-processes our `main.js` file.
gulp.task('build:ts:main', ['clean:dist:js'], function () {
    return gulp.src(['src/ts/main.config.ts', 'src/ts/main.bootstrap.ts'])
        .on('error', gutil.log)
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(ts(tsProject))
        .js
        .pipe(chmod(755))
        .pipe(concat('main.js'))
        .pipe(header(head, stamp))
        .pipe(header(banner, stamp))
        .pipe(footer(foot, stamp))
        .pipe(gif(argv.minify, uglify({
            'preserveComments' : 'some'
        })))
        .pipe(gif(argv.gzip, gzip({
            'append' : false
        })))
        .pipe(gulp.dest('dist/js'))
        .pipe(size({
            'showFiles' : true
        }));
});

// Pre-processes our TypeScript files.
gulp.task('build:ts', ['build:ts:app'], function () {
    return gulp.src(['src/ts/app/**/*.ts', 'typings/**/*.d.ts'])
        .on('error', gutil.log)
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(ts(tsProject))
        .js
        .pipe(chmod(755))
        .pipe(gif(argv.minify, uglify({
            'preserveComments' : 'some'
        })))
        .pipe(gif(argv.gzip, gzip({
            'append' : false
        })))
        .pipe(gulp.dest('dist/js/app'))
        .pipe(size({
            'showFiles' : true
        }));
});

// Build our codebase.
gulp.task('build', [
    'build:img',
    'build:scss',
    'build:ts'
]);

////////////////////////////////////////
//                                    //
//               Copies               //
//                                    //
////////////////////////////////////////

// Copy `dist` to the `assets` directory.
gulp.task('copy:assets', function () {
    return gulp.src(['dist/**/*'])
        .pipe(gulp.dest('assets'));
});

// Copy angular to the `dist/bower/angular` directory.
gulp.task('copy:dist:lib:angular', ['clean:dist:bower:angular'], function () {
    return gulp.src(['bower_components/angular/angular.min.js'])
        .pipe(chmod(755))
        .pipe(rename('angular-1.3.3.min.js'))
        .pipe(gulp.dest('dist/bower/angular'));
});

// Copy jquery to the `dist/bower/jquery` directory.
gulp.task('copy:dist:lib:jquery', ['clean:dist:bower:jquery'], function () {
    return gulp.src(['bower_components/jquery/dist/jquery.min.js'])
        .pipe(chmod(755))
        .pipe(rename('jquery-2.1.1.min.js'))
        .pipe(gulp.dest('dist/bower/jquery'));
});

// Copy requirejs to the `dist/bower/requirejs` directory.
gulp.task('copy:dist:lib:requirejs', ['clean:dist:bower:requirejs'], function () {
    return gulp.src(['bower_components/requirejs/require.js'])
        .pipe(chmod(755))
        .pipe(uglify({
            'preserveComments' : 'some'
        }))
        .pipe(rename('require-2.1.15.min.js'))
        .pipe(gulp.dest('dist/bower/requirejs'));
});

// Copy our media to the `dist/media` directory.
gulp.task('copy:dist:media', ['clean:dist:media'], function () {
    return gulp.src(['src/media/**/*'])
        .pipe(chmod(755))
        .pipe(gulp.dest('dist/media'));
});

// Copy the vendor files to the `dist/vendor` directory.
gulp.task('copy:dist:vendor', ['clean:dist:vendor'], function () {
    return gulp.src(['vendor/**/*'])
        .pipe(chmod(755))
        .pipe(gulp.dest('dist/vendor'));
});

// Copy our base files to the `root` directory.
gulp.task('copy:root', ['clean:root'], function () {
    var filter = gfilter(['*', '!favicon.ico']);
    return gulp.src([
            'src/favicon.ico',
            'src/humans.txt',
            'src/index.html',
            'src/robots.txt'
        ])
        .pipe(filter)
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(filter.restore())
        .pipe(chmod(755))
        .pipe(gulp.dest('.'));
});

// Copies the lib subdirectory
gulp.task('copy:dist:lib', [
    'copy:dist:lib:angular',
    'copy:dist:lib:jquery',
    'copy:dist:lib:requirejs'
]);

// Copies the dist directory.
gulp.task('copy:dist', [
    'copy:dist:lib',
    'copy:dist:media',
    'copy:dist:vendor'
]);

// Copies all of the dist.
gulp.task('copy', [
    'copy:dist',
    'copy:root'
]);

////////////////////////////////////////
//                                    //
//               Lints                //
//                                    //
////////////////////////////////////////

// Lints our JavaScript files.
gulp.task('lint:js', function () {
    return gulp.src(['gulpfile.js', 'karma.conf.js', 'lib/**/*.js'])
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(jscs());
});

// Lints our JSON files.
gulp.task('lint:json', function () {
    return gulp.src(['.bowerrc', 'bower.json', 'package.json'])
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(function (file) {
            log.err('File "' + file.path + '" is not valid JSON');
        }));
});

// Lints our CSS files.
gulp.task('lint:scss', function () {
    return gulp.src(['src/scss/main.scss'])
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(sass())
        .pipe(csslint());
});

// Lints our codebase.
gulp.task('lint', [
    'lint:js',
    'lint:json',
    'lint:scss'
]);

////////////////////////////////////////
//                                    //
//               Serves               //
//                                    //
////////////////////////////////////////

// Serves the `coverage` directory.
gulp.task('serve:coverage', serve({
    'middleware' : middle('coverage'),
    'port'       : port,
    'root'       : 'coverage'
}));

// Serves the `docs` directory.
gulp.task('serve:docs', serve({
    'middleware' : middle('docs'),
    'port'       : port,
    'root'       : 'docs'
}));

// Serves the `reports` directory.
gulp.task('serve:reports', serve({
    'middleware' : middle('reports'),
    'port'       : port,
    'root'       : 'reports'
}));

// Serves the `_site` directory.
gulp.task('serve:site', serve({
    'middleware' : middle('_site'),
    'port'       : port,
    'root'       : '_site'
}));

// Serves the `tests` directory.
gulp.task('serve:tests', serve({
    'middleware' : middle('tests'),
    'port'       : port,
    'root'       : 'tests'
}));

////////////////////////////////////////
//                                    //
//               Tasks                //
//                                    //
////////////////////////////////////////

// Generate PageSpeed Insights.
gulp.task('psi', function (done) {
    psi({
        'nokey'    : 'true',
        'strategy' : 'desktop',
        'url'      : env.data.site
    }, done);
});

////////////////////////////////////////
//                                    //
//              Watchers              //
//                                    //
////////////////////////////////////////

// Watch our files for changes
gulp.task('watch', function () {
    gulp.watch(['gulpfile.js', 'karma.conf.js', 'lib/**/*.js'], ['lint:js']);
    gulp.watch(['.bowerrc', 'bower.json', 'package.json'],      ['lint:json']);
    gulp.watch(['src/scss/**/*.scss'],                          ['build:scss']);
    gulp.watch(['src/ts/**/*.ts'],                              ['build:ts']);
});

////////////////////////////////////////
//                                    //
//              Releases              //
//                                    //
////////////////////////////////////////

// Pre-processes our Jekyll files.
gulp.task('jekyll', function (done) {
    spawn('jekyll', ['build'], {'stdio' : 'inherit'}).on('close', function () {
        done();
    });
});

// Publish the codebase.
gulp.task('release', ['jekyll'], function (done) {
    if (!argv.force && !env.base) {
        log.err('Incorrect environment for release.');
        return done();
    }
    return isBranch('master', argv.force)
        .catch(function (err) {
            log.err(err);
            return err;
        });
});

////////////////////////////////////////
//                                    //
//               Tests                //
//                                    //
////////////////////////////////////////

// Tests our SCSS files.
gulp.task('test:scss', function (done) {
    var
        filter = gfilter(['**/*.js']),
        specs = [];
    gulp.src(['tests/specs/src/scss/**/*'])
        .on('error', gutil.log)
        .pipe(data(dataFn(stamp)))
        .pipe(tmpl())
        .pipe(gulp.dest('.casper-temp-dir'))
        .pipe(filter)
        .pipe(tap(function (file) {
            specs.push(file.path);
        }))
        .on('end', function () {
            var
                casperArgs = ['--concise', '--includes=tests/helpers/casper.includes.js', 'test'],
                options = {'stdio' : 'inherit'};
            casperArgs = casperArgs.concat(specs);
            spawn('casperjs', casperArgs, options).on('close', function () {
                del(['.casper-temp-dir'], function (err) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
            });
        });
});

// Tests our TypeScript files.
gulp.task('test:ts', ['clean:coverage'], function () {
    return gulp.src(['./fake'])
        .on('error', gutil.log)
        .pipe(karma({
            'configFile' : 'karma.conf.js',
            'action'     : argv.debug ? 'watch' : 'run'
        }));
});

// Tests our User Interfaces
gulp.task('test:ui', ['clean:reports'], function (done) {
    var
        files = [];
    gulp.src(['tests/specs/ui/**/*.test'])
        .pipe(tap(function (file) {
            files.push(file);
        }))
        .on('end', function () {
            async.mapSeries(files, function (file, next) {
                galen(file.path, 'reports/' + file.relative.replace(/\.test/, ''), next);
            }, function () {
                done();
            });
        });
});

// Run all of our tests.
gulp.task('test', function (done) {
    var
        noop = function () {},
        next = noop,
        task,
        tasks = [
            'test:scss',
            'test:ts',
            'test:ui'
        ];
    gulp.on('task_stop', function (event) {
        if (event.task === task) {
            next();
        }
    });
    async.mapSeries(tasks, function (_task_, _next_) {
        task = _task_;
        next = _next_;
        gulp.start(task);
    }, function () {
        next = noop;
        task = '';
        done();
    });
});

////////////////////////////////////////
//                                    //
//              Default               //
//                                    //
////////////////////////////////////////

// Defines a default task
gulp.task('default', ['lint', 'test', 'build']);
