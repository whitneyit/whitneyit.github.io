'use strict';

var
    // Grab any system pacakges.
    fs         = require('fs'),
    spawn      = require('child_process').spawn,

    // Grab the `package.json` file.
    pkg        = require('./package.json'),

    // Grab any packages they we have written.
    argToBool  = require('./lib/argToBool'),
    getEnv     = require('./lib/getEnv'),
    isBranch   = require('./lib/isBranch'),
    middle     = require('./lib/middle'),

    // Grab our non gulp packages.
    del        = require('del'),
    psi        = require('psi'),
    yaml       = require('js-yaml').safeLoad,
    yargs      = require('yargs'),

    // Grab gulp and its plugins.
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    chmod      = require('gulp-chmod'),
    concat     = require('gulp-concat'),
    csslint    = require('gulp-csslint'),
    cssmin     = require('gulp-cssmin'),
    eslint     = require('gulp-eslint'),
    gif        = require('gulp-if'),
    git        = require('gulp-git'),
    gzip       = require('gulp-gzip'),
    header     = require('gulp-header'),
    image      = require('gulp-image'),
    footer     = require('gulp-footer'),
    jscs       = require('gulp-jscs'),
    jsdoc      = require('gulp-jsdoc'),
    jsonlint   = require('gulp-jsonlint'),
    karma      = require('gulp-karma'),
    plato      = require('gulp-plato'),
    rename     = require('gulp-rename'),
    rjs        = require('gulp-requirejs'),
    sass       = require('gulp-sass'),
    serve      = require('gulp-serve'),
    size       = require('gulp-size'),
    tmpl       = require('gulp-template'),
    uglify     = require('gulp-uglify'),

    // Logs out a mssage to the console as an Error.
    logErr = function (msg) {
        /*eslint no-console:0 */
        console.log(gutil.colors.red(msg));
    },

    // Logs out a mssage to the console as Info.
    logInfo = function (msg) {
        /*eslint no-console:0 */
        console.log(gutil.colors.blue(msg));
    },

    // The callback to to `del` package.
    clean = function (directory, done) {
        return function (err) {
            if (err) {
                throw err;
            }
            logInfo('Cleaned the "' + directory + '" directory.');
            done();
        };
    },

    // If any errors went wrong with our environment file.
    envErr,

    // Grab our "wrapping" files to be used by `gulp-header` and `gulp-footer`.
    head = fs.readFileSync('build/include/head.js'),
    foot = fs.readFileSync('build/include/foot.js'),

    // Whether or not we are running within the production environment.
    prod = true,

    // Grab the config files our build task depends upon.
    args = yaml(fs.readFileSync('build/config/yargs-aliases.yml')),

    // Define our cli argument aliases.
    argv = yargs.alias(args).argv,

    // The port to be used when serving directories
    port = 3333,

    // Here we stub out an Object to use in `lodash` templating.
    stamp = {
        'pkg' : pkg
    };

// Convert the some arguments to Booleans.
argv.clean  = argToBool(argv, 'clean');
argv.debug  = argToBool(argv, 'debug');
argv.force  = argToBool(argv, 'force');
argv.gzip   = argToBool(argv, 'gzip');
argv.minify = argToBool(argv, 'minify');

// Parse the environment file.
try {

    // Assign the environment `name` and `data` to the `stamp` Object.
    stamp.env = getEnv(argv, 'env');

    // Determine if we are still in the production environment
    if (stamp.env.name !== 'production') {
        prod = false;
    }

// Update `envVar` with the error that came back from `getEnv`.
} catch (err) {
    envErr = err;
}

// If we are in a production environment, override some arguments.
if (prod) {
    argv.debug  = false;
    argv.minify = true;
}

////////////////////////////////////////
//                                    //
//               Cleans               //
//                                    //
////////////////////////////////////////

// Cleans the `coverage` directory.
gulp.task('clean:coverage', function (done) {
    del(['coverage'], clean('coverage', done));
});

// Cleans the `assets/css` directory.
gulp.task('clean:assets:css', function (done) {
    del(['assets/css'], clean('assets/css', done));
});

// Cleans the `assets/img` directory.
gulp.task('clean:assets:img', function (done) {
    del(['assets/img'], clean('assets/img', done));
});

// Cleans the `assets/js` directory.
gulp.task('clean:assets:js', function (done) {
    del(['assets/js'], clean('assets/js', done));
});

// Cleans the `assets/media` directory.
gulp.task('clean:assets:media', function (done) {
    del(['assets/media'], clean('assets/media', done));
});

// Cleans the `docs` directory.
gulp.task('clean:docs', function (done) {
    del(['docs'], clean('docs', done));
});

// Cleans the `plato` directory.
gulp.task('clean:plato', function (done) {
    del(['plato'], clean('plato', done));
});

////////////////////////////////////////
//                                    //
//              Subtasks              //
//                                    //
////////////////////////////////////////

// Processes our CSS files.
gulp.task('build:css', ['clean:assets:css'], function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['bower_components/normalize.css/normalize.css', 'src/css/main.scss'])
        .on('error', gutil.log)
        .pipe(concat('whitneyit.css'))
        .pipe(sass())
        .pipe(gif(argv.minify, cssmin()))
        .pipe(chmod(755))
        .pipe(gulp.dest('assets/css'))
        .pipe(size({
            'showFiles' : true
        }));
});

// Copy our images to the `assets/imagegmisctory.
gulp.task('build:img', ['clean:assets:img'], function () {
    return gulp.src(['src/img/**/*'])
        .pipe(gif(prod, image()))
        .pipe(chmod(755))
        .pipe(gulp.dest('assets/img'));
});

// Processes our JavaScript files.
gulp.task('build:js', ['clean:assets:js'], function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['src/js/**/*.js'])
        .on('error', gutil.log)
        .pipe(header(head, stamp))
        .pipe(footer(foot, stamp))
        .pipe(tmpl(stamp))
        .pipe(chmod(755))
        .pipe(rename('whitneyit.js'))
        .pipe(gif(argv.minify, uglify({
            'preserveComments' : 'some'
        })))
        .pipe(gif(argv.gzip, gzip({
            'append' : false
        })))
        .pipe(gulp.dest('assets/js'))
        .pipe(size({
            'showFiles' : true
        }));
});

// Copy our media to the `assets/media` directory.
gulp.task('copy:media', ['clean:assets:media'], function () {
    return gulp.src(['src/media/**/*'])
        .pipe(chmod(755))
        .pipe(gulp.dest('assets/media'));
});

// Processes our Jekyll files.
gulp.task('jekyll', ['copy', 'build'], function (done) {
    spawn('jekyll', ['build'], {'stdio' : 'inherit'}).on('close', function () {
        done();
    });
});

// Lints our CSS files.
gulp.task('lint:css', function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['src/css/main.css'])
        .pipe(tmpl(stamp))
        .pipe(concat('glasshat.css'))
        .pipe(sass())
        .pipe(csslint());
});

// Lints our JavaScript files.
gulp.task('lint:js', function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['gulpfile.js', 'karma.conf.js', 'lib/**/*.js', 'src/js/**/*.js', 'tests/**/*.js'])
        .pipe(tmpl(stamp))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(jscs());
});

// Lints our JSON files.
gulp.task('lint:json', function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['.bowerrc', 'bower.json', 'package.json'])
        .pipe(tmpl(stamp))
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(function (file) {
            logErr('File "' + file.path + '" is not valid JSON');
        }));
});

////////////////////////////////////////
//                                    //
//              Aliases               //
//                                    //
////////////////////////////////////////

// Build our codebase.
gulp.task('build', [
    'build:css',
    'build:img',
    'build:js'
]);

// Cleans the assets directory.
gulp.task('clean:assets', [
    'clean:assets:css',
    'clean:assets:img',
    'clean:assets:js',
    'clean:assets:media'
]);

// Cleans all other directories.
gulp.task('clean', [
    'clean:assets',
    'clean:coverage',
    'clean:docs',
    'clean:plato'
]);

// Copies all of the assets.
gulp.task('copy', [
    'copy:media'
]);

// Lints our codebase.
gulp.task('lint', [
    'lint:css',
    'lint:js',
    'lint:json'
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

// Serves the `plato` directory.
gulp.task('serve:plato', serve({
    'middleware' : middle('plato'),
    'port'       : port,
    'root'       : 'plato'
}));

// Serves the `_site` directory.
gulp.task('serve:site', serve({
    'middleware' : middle('_site'),
    'port'       : port,
    'root'       : '_site'
}));

////////////////////////////////////////
//                                    //
//               Tasks                //
//                                    //
////////////////////////////////////////

// Generates our docs using JSDoc.
gulp.task('doc', ['clean:docs'], function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['gulpfile.js', 'lib/**/*.js', 'src/js/**/*.js', 'tests/**/*.js'])
        .pipe(tmpl(stamp))
        .pipe(jsdoc('docs'));
});

// Generate complexity analysis.
gulp.task('plato', ['clean:plato'], function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['src/js/**/*.js'])
        .pipe(plato('plato', {
            'complexity' : {
                'trycatch' : true
            }
        }));
});

// Generate PageSpeed Insights.
gulp.task('psi', function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    psi({
        'nokey'    : 'true',
        'strategy' : 'desktop',
        'url'      : stamp.env.data.site
    }, done);
});

////////////////////////////////////////
//                                    //
//              Releases              //
//                                    //
////////////////////////////////////////

// Publish the codebase.
gulp.task('release', ['jekyll'], function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    if (!argv.force && !prod) {
        logErr('Incorrect environment for release.');
        return done();
    }
    isBranch('master')
        .then(function () {
            return;
        })
        .catch(function (err) {
            logErr(err);
            return err;
        });
});

////////////////////////////////////////
//                                    //
//               Tests                //
//                                    //
////////////////////////////////////////

// Tests our specs.
gulp.task('test', ['clean:coverage'], function (done) {
    if (envErr) {
        logErr(envErr);
        return done();
    }
    return gulp.src(['./fake'])
        .on('error', gutil.log)
        .pipe(karma({
            'configFile' : 'karma.conf.js',
            'action'     : argv.debug ? 'watch' : 'run'
        }));
});

////////////////////////////////////////
//                                    //
//              Default               //
//                                    //
////////////////////////////////////////

// Defines a default task
gulp.task('default', ['lint', 'test', 'plato', 'build']);
