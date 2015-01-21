/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../../typings/requirejs/require.d.ts" />

interface jasmine13VersionInterface {
    major :string;
    minor :string;
    build :string;
    revision :string;
}

declare module jasmine {
    var version :string;
    var version_ :jasmine13VersionInterface;
}

'use strict';

/**
 * @description
 * Because all of our specs should be in subfolders that are siblings to this
 * file, it means that this is the first spec that will run and thus it allows
 * us to provide some feedback to the user as well as configure `requirejs`.
 *
 * Because we are modifiying the `requirejs` Object directly, any configuration
 * changes that are made here will be inherited by every other spec that we
 * write. It is for that reason that we overwrite the default `onError` Function
 * that is defined by `requirejs`.
 *
 * We overwrite this Function so that we can get some more meaningful
 * information logged to the console upon our code running in to an Error.
 *
 * @param {Error} err - The Error supplied by `requirejs`.
 *
 * @return {Void}
 */
requirejs.onError = (err) => {

    // Add the module in which the `err` was found to the `message`.
    if ('requireModules' in err) {
        err.message += '\nModule(s): "' + err.requireModules.join(', ') + '"';
    }

    // Add the type of require to the module.
    if ('requireType' in err) {
        err.message += '\nType: ' + err.requireType;
    }

    // Throw the updated Error.
    throw err;

};

/**
 * @description
 * With our setup now complete we can start writing our tests.
 */
define([], () => {
/* eslint brace-style:0 no-console:0 */

    var
        // Here we write some basic tests to make sure that we have setup our
        // testing framework correctly. The framework to be used is `jasmine`,
        // specifically the `2.0` version.
        //
        // So we take that opportunity to log our which version of jasmine we
        // are currently using. We need to do this because of the way `karma`
        // loads jasmine onto the page. They way you configure `karma` to load
        // the appropriate version of jasmine is via the `karma-jasmine` npm
        // package. Currently the `0.1.x` version of the package targets jasmine
        // 1.3 whilst the `0.2.x` version targets jasmine 2.0.
        //
        // So, now we figure out which version of jasmine we are using. In jasmine
        // 1.3 `jasmine.version` pointed to an Objected that as you can see
        // below contained information regarding to its `major`, `minor`, and
        // `build` version numbers as well as its `revsion` ID. This was all
        // greatly simplified in jasmine 2.0 where `jasmine.version` simply
        // points to a String that contains that information.
        //
        // Even though we have specifieded that we are using 0.2.x version of
        // `karma-jasmine` it is good to have this fallback so that if we update
        // the package we will be notified if the version of jasmine changes.
        //
        // So what we do here is check to see if we are dealing with a String
        // and if we are, we return that, else we create the same string but
        // based off of all the individual parts exposed by jasmine 1.3.
        version = typeof jasmine.version === 'string' ? jasmine.version : [
            jasmine.version_.major, '.',
            jasmine.version_.minor, '.',
            jasmine.version_.build, '-',
            jasmine.version_.revision
        ].join('');

    // Let the user know which version of jasmine is running.
    console.log('Testing using jasmine version: ' + version);

    // Start writing our tests.
    describe('our app', () => {

        // Although this test looks stupid, it actually isn't. It is perfect for
        // proving that we have all the required frameworks, packages, and gulp
        // tasks configured correctly. It proves that we can run tests and that
        // our custom matchers are configured.
        it('should have tests', () => {
            expect(true).toBe(true);
        });

    });

});

/* vim: set cc=0 : */
