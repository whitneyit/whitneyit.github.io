'use strict';

var
    // Grab any system pacakges.
    fs         = require('fs'),
    spawn      = require('child_process').spawn,

    // Grab the `package.json` file.
    pkg        = require('./package.json'),

    // Grab any packages they we have written.
    argToBool  = require('./lib/argToBool'),
    isBranch   = require('./lib/isBranch'),
    middle     = require('./lib/middle'),

    // Grab our non gulp packages.
    de         = require('detect-environment'),
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

    // Determine the environment and grab the `envData`.
    env = de(),

    // Grab our "wrapping" files to be used by `gulp-header` and `gulp-footer`.
    head = fs.readFileSync('build/include/head.js'),
    foot = fs.readFileSync('build/include/foot.js'),

    // Grab the config files our build task depends upon.
    args = yaml(fs.readFileSync('build/config/yargs-aliases.yml')),

    // Define our cli argument aliases.
    argv = yargs.alias(args).argv,

    // The port to be used when serving directories
    port = 3333,

    // Here we stub out an Object to use in `lodash` templating.
    stamp = {
        'env' : env,
        'pkg' : pkg
    };

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
    del(['assets'], clean('assets', done));
});

// Cleans the `assets/img` directory.
gulp.task('clean:assets:img', function (done) {
    del(['assets/img'], clean('assets/img', done));
});

// Cleans the `assets/js` directory.
gulp.task('clean:assets:js', function (done) {
    del(['assets/js'], clean('assets/js', done));
});

// Cleans the `assets/lib` directory.
gulp.task('clean:assets:lib', function (done) {
    del(['assets/lib'], clean('assets/lib', done));
});

// Cleans the `assets/lib/angular` directory.
gulp.task('clean:assets:lib:angular', function (done) {
    del(['assets/lib/angular'], clean('assets/lib/angular', done));
});

// Cleans the `assets/lib/jquery` directory.
gulp.task('clean:assets:lib:jquery', function (done) {
    del(['assets/lib/jquery'], clean('assets/lib/jquery', done));
});

// Cleans the `assets/lib/requirejs` directory.
gulp.task('clean:assets:lib:requirejs', function (done) {
    del(['assets/lib/requirejs'], clean('assets/lib/requirejs', done));
});

// Cleans the `assets/media` directory.
gulp.task('clean:assets:media', function (done) {
    del(['assets/media'], clean('assets/media', done));
});

// Cleans the `assets/scss` directory.
gulp.task('clean:assets:scss', function (done) {
    del(['assets/scss'], clean('assets/scss', done));
});

// Cleans the `assets/vendor` directory.
gulp.task('clean:assets:vendor', function (done) {
    del(['assets/vendor'], clean('assets/vendor', done));
});

// Cleans the `coverage` directory.
gulp.task('clean:coverage', function (done) {
    del(['coverage'], clean('coverage', done));
});

// Cleans the `docs` directory.
gulp.task('clean:docs', function (done) {
    del(['docs'], clean('docs', done));
});

// Cleans the `plato` directory.
gulp.task('clean:plato', function (done) {
    del(['plato'], clean('plato', done));
});

// Cleans the `root` directory.
gulp.task('clean:root', function (done) {
    del([
        'favicon.ico',
        'humans.txt',
        'index.html',
        'robots.txt'
    ], clean('root', done));
});

////////////////////////////////////////
//                                    //
//              Subtasks              //
//                                    //
////////////////////////////////////////

// Pre-processes our SCSS files.
gulp.task('build:scss', ['clean:assets:scss'], function () {
    return gulp.src(['bower_components/normalize.css/normalize.css', 'src/scss/main.scss'])
        .on('error', gutil.log)
        .pipe(tmpl(stamp))
        .pipe(concat('whitneyit.css'))
        .pipe(sass())
        .pipe(gif(argv.minify, cssmin()))
        .pipe(chmod(755))
        .pipe(rename('whitneyit.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(size({
            'showFiles' : true
        }));
});

// Pre-processes our image files.
gulp.task('build:img', ['clean:assets:img'], function () {
    return gulp.src(['src/img/**/*'])
        .pipe(gif(env.base, image()))
        .pipe(chmod(755))
        .pipe(gulp.dest('assets/img'));
});

// Pre-processes our JavaScript files.
gulp.task('build:js:main', ['clean:assets:js'], function (done) {
    return gulp.src(['src/js/main.js'])
        .on('error', gutil.log)
        .pipe(tmpl(stamp))
        .pipe(chmod(755))
        .pipe(header(head, stamp))
        .pipe(footer(foot, stamp))
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

// Pre-processes our JavaScript files.
gulp.task('build:js', ['build:js:main'], function (done) {
    return gulp.src(['src/js/**/*.js', '!src/js/main.js'])
        .on('error', gutil.log)
        .pipe(tmpl(stamp))
        .pipe(chmod(755))
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

// Copy angular to the `assets/lib/angular` directory.
gulp.task('copy:assets:lib:angular', ['clean:assets:lib:angular'], function () {
    return gulp.src(['bower_components/angular/angular.min.js'])
        .pipe(chmod(755))
        .pipe(rename('angular-1.3.3.min.js'))
        .pipe(gulp.dest('assets/lib/angular'));
});

// Copy jquery to the `assets/lib/jquery` directory.
gulp.task('copy:assets:lib:jquery', ['clean:assets:lib:jquery'], function () {
    return gulp.src(['bower_components/jquery/dist/jquery.min.js'])
        .pipe(chmod(755))
        .pipe(rename('jquery-2.1.1.min.js'))
        .pipe(gulp.dest('assets/lib/jquery'));
});

// Copy requirejs to the `assets/lib/requirejs` directory.
gulp.task('copy:assets:lib:requirejs', ['clean:assets:lib:requirejs'], function () {
    return gulp.src(['bower_components/requirejs/require.js'])
        .pipe(chmod(755))
        .pipe(uglify({
            'preserveComments' : 'some'
        }))
        .pipe(rename('require-2.1.15.min.js'))
        .pipe(gulp.dest('assets/lib/requirejs'));
});

// Copy our media to the `assets/media` directory.
gulp.task('copy:assets:media', ['clean:assets:media'], function () {
    return gulp.src(['src/media/**/*'])
        .pipe(chmod(755))
        .pipe(gulp.dest('assets/media'));
});

// Copy our media to the `assets/vendor` directory.
gulp.task('copy:assets:vendor', ['clean:assets:vendor'], function () {
    return gulp.src(['vendor/**/*'])
        .pipe(chmod(755))
        .pipe(gulp.dest('assets/vendor'));
});

// Copy our media to the `root` directory.
gulp.task('copy:root', ['clean:root'], function () {
    return gulp.src([
            'src/favicon.ico',
            'src/humans.txt',
            'src/index.html',
            'src/robots.txt'
        ])
        .pipe(chmod(755))
        .pipe(gulp.dest('.'));
});

// Pre-processes our Jekyll files.
gulp.task('jekyll', ['copy', 'build'], function (done) {
    spawn('jekyll', ['build'], {'stdio' : 'inherit'}).on('close', function () {
        done();
    });
});

// Lints our CSS files.
gulp.task('lint:scss', function () {
    return gulp.src(['src/scss/main.scss'])
        .pipe(tmpl(stamp))
        .pipe(sass())
        .pipe(csslint());
});

// Lints our JavaScript files.
gulp.task('lint:js', function () {
    return gulp.src(['gulpfile.js', 'karma.conf.js', 'lib/**/*.js', 'src/js/**/*.js', 'tests/**/*.js'])
        .pipe(tmpl(stamp))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(jscs());
});

// Lints our JSON files.
gulp.task('lint:json', function () {
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
    'build:img',
    'build:js',
    'build:scss'
]);

// Cleans the asset subdirectories.
gulp.task('clean:assets:lib:all', [
    'clean:assets:lib:angular',
    'clean:assets:lib:jquery',
    'clean:assets:lib:requirejs'
]);

// Cleans the asset subdirectories.
gulp.task('clean:assets:all', [
    'clean:assets:img',
    'clean:assets:js',
    'clean:assets:lib',
    'clean:assets:media',
    'clean:assets:scss',
    'clean:assets:vendor'
]);

// Cleans all other directories.
gulp.task('clean', [
    'clean:assets',
    'clean:coverage',
    'clean:docs',
    'clean:plato',
    'clean:root'
]);

// Copies the lib subdirectory
gulp.task('copy:assets:lib', [
    'copy:assets:lib:angular',
    'copy:assets:lib:jquery',
    'copy:assets:lib:requirejs'
]);

// Copies the assets directory.
gulp.task('copy:assets', [
    'copy:assets:lib',
    'copy:assets:media',
    'copy:assets:vendor'
]);

// Copies all of the assets.
gulp.task('copy', [
    'copy:assets',
    'copy:root'
]);

// Lints our codebase.
gulp.task('lint', [
    'lint:scss',
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
gulp.task('doc', ['clean:docs'], function () {
    return gulp.src(['gulpfile.js', 'lib/**/*.js', 'src/js/**/*.js', 'tests/**/*.js'])
        .pipe(tmpl(stamp))
        .pipe(jsdoc('docs'));
});

// Generate complexity analysis.
gulp.task('plato', ['clean:plato'], function () {
    return gulp.src(['src/js/**/*.js'])
        .pipe(plato('plato', {
            'complexity' : {
                'trycatch' : true
            }
        }));
});

// Generate PageSpeed Insights.
gulp.task('psi', function (done) {
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
    if (!argv.force && !env.base) {
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
gulp.task('test', ['clean:coverage'], function () {
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
gulp.task('default', ['lint', 'test', 'plato']);
